from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.mentorship import (
    MentorshipRequest,
    MentorshipRequestCreate,
    MentorshipRequestUpdate,
    MentorshipRequestWithDetails
)
from app.schemas.notification import NotificationCreate
from app.crud import mentorship as crud_mentorship
from app.api.deps import get_current_user, get_current_student, get_current_professor
from app.models.user import User
from app.models.student import Student
from app.models.professor import Professor
from app.models.group import Group, group_mentors
from app.models.notification import Notification
from datetime import datetime

router = APIRouter()


def create_notification(db: Session, notification: NotificationCreate):
    """Helper function to create notifications"""
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


@router.post("/", response_model=MentorshipRequest, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(
    request_data: MentorshipRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    """Create a new mentorship request (student only, must be group leader)"""
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Verify the student is the one making the request
    if request_data.requested_by != student.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create requests for yourself"
        )
    
    # Get the group
    group = db.query(Group).filter(Group.id == request_data.group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Verify the student is the group leader
    if group.leader_id != student.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the group leader can send mentorship requests"
        )
    
    # Check if group already has 2 mentors
    mentor_count = db.query(group_mentors).filter(
        group_mentors.c.group_id == request_data.group_id
    ).count()
    
    if mentor_count >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This group already has the maximum number of mentors (2)"
        )
    
    # Check active (pending) requests count for this group
    active_requests = crud_mentorship.get_active_requests_count_for_group(db, request_data.group_id)
    if active_requests >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have 2 active mentorship requests. Wait for a response or withdraw a request."
        )
    
    # Check if there's already a pending request to this professor from this group
    existing_request = crud_mentorship.get_pending_request_to_professor(
        db, request_data.group_id, request_data.professor_id
    )
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending request to this professor"
        )
    
    # Get professor to check availability
    professor = db.query(Professor).filter(Professor.id == request_data.professor_id).first()
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor not found"
        )
    
    if professor.available_slots <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This professor has no available mentorship slots"
        )
    
    # Create the mentorship request
    db_request = crud_mentorship.create_mentorship_request(db, request_data)
    
    # Create notification for the professor
    create_notification(
        db,
        NotificationCreate(
            user_id=professor.user_id,
            type="mentorship_request",
            title="New Mentorship Request",
            message=f"{student.user.name} has requested you to mentor their group '{group.name}'",
            related_group_id=group.id,
            related_student_id=student.id,
            related_request_id=db_request.id,
            link=f"/professor/mentorship-requests"
        )
    )
    
    return db_request


@router.get("/professor/{professor_id}", response_model=List[MentorshipRequestWithDetails])
def get_professor_mentorship_requests(
    professor_id: int,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get mentorship requests for a professor"""
    # Get current professor
    professor = db.query(Professor).filter(Professor.user_id == current_user.id).first()
    
    # Verify user is the professor or admin
    if current_user.role != "admin":
        if not professor or professor.id != professor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these requests"
            )
    
    requests = crud_mentorship.get_mentorship_requests_for_professor(db, professor_id, status)
    
    # Build detailed response
    result = []
    for req in requests:
        result.append({
            **req.__dict__,
            "group_name": req.group.name,
            "group_description": req.group.description,
            "group_needed_skills": req.group.needed_skills,
            "requester_name": req.requester.user.name,
            "requester_email": req.requester.user.email,
            "professor_name": professor.user.name if professor else ""
        })
    
    return result


@router.get("/group/{group_id}", response_model=List[MentorshipRequest])
def get_group_mentorship_requests(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get mentorship requests for a group (leader only)"""
    # Get the group
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Verify user is the group leader or admin
    if current_user.role != "admin":
        if not student or student.id != group.leader_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the group leader can view mentorship requests"
            )
    
    return crud_mentorship.get_mentorship_requests_for_group(db, group_id)


@router.put("/{request_id}/status", response_model=MentorshipRequest)
def update_mentorship_request(
    request_id: int,
    update_data: MentorshipRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_professor)
):
    """Accept or reject a mentorship request (professor only)"""
    # Get the request
    mentorship_request = crud_mentorship.get_mentorship_request(db, request_id)
    if not mentorship_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentorship request not found"
        )
    
    # Get current professor
    professor = db.query(Professor).filter(Professor.user_id == current_user.id).first()
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor profile not found"
        )
    
    # Verify the professor is the one being requested
    if mentorship_request.professor_id != professor.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only respond to requests directed to you"
        )
    
    # Check if request is still pending
    if mentorship_request.status != 'pending':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This request has already been {mentorship_request.status}"
        )
    
    # Validate status
    if update_data.status not in ['accepted', 'rejected']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'accepted' or 'rejected'"
        )
    
    # If rejecting, require rejection reason
    if update_data.status == 'rejected' and not update_data.rejection_reason:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rejection reason is required when rejecting a request"
        )
    
    # If accepting, perform additional checks and updates
    if update_data.status == 'accepted':
        # Check if professor has available slots
        if professor.available_slots <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have no available mentorship slots"
            )
        
        # Check if group already has 2 mentors
        group = mentorship_request.group
        mentor_count = db.query(group_mentors).filter(
            group_mentors.c.group_id == group.id
        ).count()
        
        if mentor_count >= 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This group already has the maximum number of mentors (2)"
            )
        
        # Add professor as mentor to the group
        stmt = group_mentors.insert().values(
            group_id=group.id,
            professor_id=professor.id
        )
        db.execute(stmt)
        
        # Update group mentor status
        group.has_mentor = True
        group.mentor_count = mentor_count + 1
        
        # Decrement professor's available slots
        professor.available_slots -= 1
        
        # If group now has 2 mentors, reject all other pending requests
        if group.mentor_count >= 2:
            crud_mentorship.reject_other_pending_requests_for_group(db, group.id, request_id)
    
    # Update the request status
    updated_request = crud_mentorship.update_mentorship_request_status(
        db, request_id, update_data.status, update_data.rejection_reason
    )
    
    # Create notification for the student who requested
    requester = mentorship_request.requester
    group = mentorship_request.group
    
    if update_data.status == 'accepted':
        notification_message = f"Professor {professor.user.name} has accepted your mentorship request for '{group.name}'"
        notification_type = "mentorship_accepted"
    else:
        notification_message = f"Professor {professor.user.name} has declined your mentorship request for '{group.name}'"
        notification_type = "mentorship_rejected"
    
    create_notification(
        db,
        NotificationCreate(
            user_id=requester.user_id,
            type=notification_type,
            title=f"Mentorship Request {update_data.status.capitalize()}",
            message=notification_message,
            related_group_id=group.id,
            related_request_id=request_id,
            link=f"/student/groups/{group.id}" if update_data.status == 'accepted' else None
        )
    )
    
    return updated_request


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def withdraw_mentorship_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    """Withdraw a pending mentorship request (student only)"""
    # Get the request
    mentorship_request = crud_mentorship.get_mentorship_request(db, request_id)
    if not mentorship_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentorship request not found"
        )
    
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Verify the student is the one who made the request
    if mentorship_request.requested_by != student.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only withdraw your own requests"
        )
    
    # Check if request is still pending
    if mentorship_request.status != 'pending':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot withdraw a request that has been {mentorship_request.status}"
        )
    
    # Delete the request
    db.delete(mentorship_request)
    db.commit()
    
    return None