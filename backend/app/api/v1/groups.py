from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.group import (
    Group, GroupCreate, GroupUpdate, GroupInvitation, 
    GroupInvitationCreate, GroupJoinRequest, GroupJoinRequestCreate, GroupMember
)
from app.schemas.notification import Notification as NotificationSchema, NotificationCreate
from app.crud import group as crud_group
from app.api.deps import get_current_user
from app.models.user import User
from app.models.group import Group as GroupModel, GroupMember as GroupMemberModel, GroupJoinRequest as GroupJoinRequestModel
from app.models.student import Student
from app.models.professor import Professor
from app.models.notification import Notification
from app.models.group import group_mentors

router = APIRouter()


def create_notification(db: Session, notification: NotificationCreate):
    """Helper function to create notifications"""
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


@router.get("/", response_model=List[Group])
def read_groups(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    groups_data = crud_group.get_groups(db, skip=skip, limit=limit)
    
    # Enrich groups with mentor information
    result = []
    for group in groups_data:
        group_dict = {
            **group.__dict__,
            "mentors": [],
            "mentor_count": group.mentor_count or 0
        }
        
        # Fetch mentors if group has any
        if group.has_mentor:
            mentor_records = db.execute(
                group_mentors.select().where(group_mentors.c.group_id == group.id)
            ).fetchall()
            
            for record in mentor_records:
                professor = db.query(Professor).filter(Professor.id == record.professor_id).first()
                if professor:
                    group_dict["mentors"].append({
                        "id": professor.id,
                        "name": professor.user.name,
                        "email": professor.user.email,
                        "department": professor.department,
                        "research_areas": professor.research_areas
                    })
        
        result.append(group_dict)
    
    return result


@router.get("/my-groups", response_model=List[Group])
def read_my_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all groups where current user is a member (including as leader)"""
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    
    # Get all group memberships
    group_members = db.query(GroupMemberModel).filter(
        GroupMemberModel.student_id == student.id
    ).all()
    
    # Get the actual groups
    group_ids = [gm.group_id for gm in group_members]
    groups_data = db.query(GroupModel).filter(GroupModel.id.in_(group_ids)).all()
    
    # Enrich groups with mentor information
    result = []
    for group in groups_data:
        group_dict = {
            **group.__dict__,
            "mentors": [],
            "mentor_count": group.mentor_count or 0
        }
        
        # Fetch mentors if group has any
        if group.has_mentor:
            mentor_records = db.execute(
                group_mentors.select().where(group_mentors.c.group_id == group.id)
            ).fetchall()
            
            for record in mentor_records:
                professor = db.query(Professor).filter(Professor.id == record.professor_id).first()
                if professor:
                    group_dict["mentors"].append({
                        "id": professor.id,
                        "name": professor.user.name,
                        "email": professor.user.email,
                        "department": professor.department,
                        "research_areas": professor.research_areas
                    })
        
        result.append(group_dict)
    
    return result


@router.get("/{group_id}", response_model=Group)
def read_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = crud_group.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Add mentor information
    group_dict = {
        **db_group.__dict__,
        "mentors": [],
        "mentor_count": db_group.mentor_count or 0
    }
    
    # Fetch mentors if group has any
    if db_group.has_mentor:
        mentor_records = db.execute(
            group_mentors.select().where(group_mentors.c.group_id == group_id)
        ).fetchall()
        
        for record in mentor_records:
            professor = db.query(Professor).filter(Professor.id == record.professor_id).first()
            if professor:
                group_dict["mentors"].append({
                    "id": professor.id,
                    "name": professor.user.name,
                    "email": professor.user.email,
                    "department": professor.department,
                    "research_areas": professor.research_areas
                })
    
    return group_dict


@router.get("/{group_id}/members", response_model=List[GroupMember])
def read_group_members(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all members of a group"""
    db_group = crud_group.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    members = db.query(GroupMemberModel).filter(GroupMemberModel.group_id == group_id).all()
    return members


@router.post("/", response_model=Group, status_code=status.HTTP_201_CREATED)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new group - students can only create one group"""
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create groups"
        )
    
    # Check if student already leads a group
    existing_group = db.query(GroupModel).filter(
        GroupModel.leader_id == student.id
    ).first()
    
    if existing_group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already lead a group. Students can only create one group."
        )
    
    # Ensure the leader_id matches current student
    if group.leader_id != student.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create groups where you are the leader"
        )
    
    return crud_group.create_group(db=db, group=group)


@router.put("/{group_id}", response_model=Group)
def update_group(
    group_id: int,
    group: GroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = crud_group.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Check if current user is the group leader
    if current_user.role != "admin":
        if not student or student.id != db_group.leader_id:
            raise HTTPException(status_code=403, detail="Only the group leader can update the group")
    
    return crud_group.update_group(db=db, group_id=group_id, group=group)


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = crud_group.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Get current student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Check if current user is the group leader
    if current_user.role != "admin":
        if not student or student.id != db_group.leader_id:
            raise HTTPException(status_code=403, detail="Only the group leader can delete the group")
    
    crud_group.delete_group(db, group_id=group_id)
    return None


@router.post("/{group_id}/members/{student_id}")
def add_member_to_group(
    group_id: int,
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = crud_group.add_group_member(db, group_id=group_id, student_id=student_id)
    if member is None:
        raise HTTPException(status_code=400, detail="Cannot add member (group full or not found)")
    
    return {"message": "Member added successfully"}


@router.delete("/{group_id}/members/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member_from_group(
    group_id: int,
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get current student
    current_student = db.query(Student).filter(Student.user_id == current_user.id).first()
    group = crud_group.get_group(db, group_id=group_id)
    
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Allow removal if:
    # 1. User is removing themselves
    # 2. User is the group leader
    # 3. User is admin
    if current_user.role != "admin":
        if not current_student:
            raise HTTPException(status_code=403, detail="Not authorized")
        if current_student.id != student_id and current_student.id != group.leader_id:
            raise HTTPException(status_code=403, detail="You can only remove yourself or you must be the group leader")
    
    success = crud_group.remove_group_member(db, group_id=group_id, student_id=student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Member not found in group")
    
    return None


@router.post("/invitations/", response_model=GroupInvitation, status_code=status.HTTP_201_CREATED)
def create_invitation(
    invitation: GroupInvitationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if student is already a member of the group
    existing_member = db.query(GroupMemberModel).filter(
        GroupMemberModel.group_id == invitation.group_id,
        GroupMemberModel.student_id == invitation.student_id
    ).first()
    
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This student is already a member of the group"
        )
    
    # Check if there's already a pending invitation for this student
    existing_invitation = db.query(GroupInvitation).filter(
        GroupInvitation.group_id == invitation.group_id,
        GroupInvitation.student_id == invitation.student_id,
        GroupInvitation.status == "pending"
    ).first()
    
    if existing_invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This student already has a pending invitation to this group"
        )
    
    result = crud_group.create_invitation(db=db, invitation=invitation)
    
    # Create notification for invited student
    invited_student = db.query(Student).filter(Student.id == invitation.student_id).first()
    if invited_student:
        group = crud_group.get_group(db, invitation.group_id)
        create_notification(
            db,
            NotificationCreate(
                user_id=invited_student.user_id,
                type="group_invitation",
                title="Group Invitation",
                message=f"You've been invited to join {group.name if group else 'a group'}",
                related_group_id=invitation.group_id,
                related_student_id=invited_student.id,
                related_request_id=result.id,
                link=f"/student/groups/{invitation.group_id}"
            )
        )
    
    return result


@router.get("/invitations/student/{student_id}", response_model=List[GroupInvitation])
def read_student_invitations(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get current student
    current_student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Check if current user is the student or admin
    if current_user.role != "admin":
        if not current_student or current_student.id != student_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud_group.get_invitations_for_student(db, student_id=student_id)


@router.put("/invitations/{invitation_id}/status")
def update_invitation(
    invitation_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invitation = crud_group.update_invitation_status(db, invitation_id=invitation_id, status=status)
    if invitation is None:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # If accepted, add student to group
    if status == "accepted":
        crud_group.add_group_member(db, group_id=invitation.group_id, student_id=invitation.student_id)
    
    # Notify group leader about response
    group = crud_group.get_group(db, invitation.group_id)
    if group:
        leader_student = db.query(Student).filter(Student.id == group.leader_id).first()
        if leader_student:
            student = db.query(Student).filter(Student.id == invitation.student_id).first()
            if student:
                create_notification(
                    db,
                    NotificationCreate(
                        user_id=leader_student.user_id,
                        type=f"invitation_{status}",
                        title=f"Invitation {status.capitalize()}",
                        message=f"{student.user.name} has {status} your invitation to {group.name}",
                        related_group_id=group.id,
                        link=f"/student/mygroups"
                    )
                )
    
    return {"message": f"Invitation {status}"}


@router.post("/join-requests/", response_model=GroupJoinRequest, status_code=status.HTTP_201_CREATED)
def create_join_request(
    join_request: GroupJoinRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a request to join a group"""
    # Verify the student is not already in the group
    group = crud_group.get_group(db, group_id=join_request.group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check if student is the leader
    if group.leader_id == join_request.student_id:
        raise HTTPException(status_code=400, detail="You are already the leader of this group")
    
    # Check if already a member
    existing_member = db.query(GroupMemberModel).filter(
        GroupMemberModel.group_id == join_request.group_id,
        GroupMemberModel.student_id == join_request.student_id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="You are already a member of this group")
    
    # Check for pending join request
    existing_request = db.query(GroupJoinRequestModel).filter(
        GroupJoinRequestModel.group_id == join_request.group_id,
        GroupJoinRequestModel.student_id == join_request.student_id,
        GroupJoinRequestModel.status == "pending"
    ).first()
    
    if existing_request:
        raise HTTPException(status_code=400, detail="You already have a pending join request for this group")
    
    result = crud_group.create_join_request(db=db, join_request=join_request)
    
    # Create notification for group leader
    leader_student = db.query(Student).filter(Student.id == group.leader_id).first()
    requesting_student = db.query(Student).filter(Student.id == join_request.student_id).first()
    
    if leader_student and requesting_student:
        create_notification(
            db,
            NotificationCreate(
                user_id=leader_student.user_id,
                type="join_request",
                title="New Join Request",
                message=f"{requesting_student.user.name} wants to join {group.name}",
                related_group_id=group.id,
                related_student_id=requesting_student.id,
                related_request_id=result.id,
                link=f"/student/mygroups"
            )
        )
    
    return result


@router.get("/join-requests/group/{group_id}", response_model=List[GroupJoinRequest])
def get_group_join_requests(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all pending join requests for a group (leader only)"""
    group = crud_group.get_group(db, group_id=group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Get current student
    current_student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Verify user is the group leader
    if not current_student or current_student.id != group.leader_id:
        raise HTTPException(status_code=403, detail="Only the group leader can view join requests")
    
    return crud_group.get_join_requests_for_group(db, group_id=group_id)


@router.put("/join-requests/{request_id}/status")
def update_join_request(
    request_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a join request status (accept/reject)"""
    join_request = crud_group.update_join_request_status(db, request_id=request_id, status=status)
    if not join_request:
        raise HTTPException(status_code=404, detail="Join request not found")
    
    # If accepted, add student to group
    if status == "accepted":
        crud_group.add_group_member(db, group_id=join_request.group_id, student_id=join_request.student_id)
    
    # Notify requesting student about the decision
    requesting_student = db.query(Student).filter(Student.id == join_request.student_id).first()
    group = crud_group.get_group(db, join_request.group_id)
    
    if requesting_student and group:
        create_notification(
            db,
            NotificationCreate(
                user_id=requesting_student.user_id,
                type=f"join_request_{status}",
                title=f"Join Request {status.capitalize()}",
                message=f"Your request to join {group.name} has been {status}",
                related_group_id=group.id,
                link=f"/student/groups/{group.id}" if status == "accepted" else None
            )
        )
    
    return {"message": f"Join request {status}"}