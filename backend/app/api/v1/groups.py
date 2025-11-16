from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.group import Group, GroupCreate, GroupUpdate, GroupInvitation, GroupInvitationCreate
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
        if current_user.student and current_user.student[0].id != db_group.leader_id:
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
        if current_user.student and current_user.student[0].id != db_group.leader_id:
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
        if current_user.student and current_user.student[0].id != student_id:
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