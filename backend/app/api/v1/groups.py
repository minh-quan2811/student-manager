from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.group import Group, GroupCreate, GroupUpdate, GroupInvitation, GroupInvitationCreate, GroupJoinRequest, GroupJoinRequestCreate
from app.crud import group as crud_group
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[Group])
def read_groups(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    groups = crud_group.get_groups(db, skip=skip, limit=limit)
    return groups


@router.get("/{group_id}", response_model=Group)
def read_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = crud_group.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    return db_group


@router.post("/", response_model=Group, status_code=status.HTTP_201_CREATED)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    
    # Check if current user is the group leader or admin
    if current_user.role != "admin":
        if current_user.student and current_user.student.id != db_group.leader_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
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
    
    # Check if current user is the group leader or admin
    if current_user.role != "admin":
        if current_user.student and current_user.student.id != db_group.leader_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
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
    return crud_group.create_invitation(db=db, invitation=invitation)


@router.get("/invitations/student/{student_id}", response_model=List[GroupInvitation])
def read_student_invitations(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if current user is the student or admin
    if current_user.role != "admin":
        if current_user.student and current_user.student.id != student_id:
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
    existing_member = db.query(crud_group.GroupMember).filter(
        crud_group.GroupMember.group_id == join_request.group_id,
        crud_group.GroupMember.student_id == join_request.student_id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="You are already a member of this group")
    
    return crud_group.create_join_request(db=db, join_request=join_request)


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
    
    # Verify user is the group leader
    if current_user.student and current_user.student.id != group.leader_id:
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
    
    return {"message": f"Join request {status}"}