from sqlalchemy.orm import Session, joinedload
from app.models.group import Group, GroupMember, GroupInvitation, GroupJoinRequest
from app.schemas.group import GroupCreate, GroupUpdate, GroupInvitationCreate, GroupJoinRequestCreate
from typing import List, Optional


def get_group(db: Session, group_id: int) -> Optional[Group]:
    return db.query(Group).filter(Group.id == group_id).first()


def get_groups(db: Session, skip: int = 0, limit: int = 100) -> List[Group]:
    return db.query(Group).offset(skip).limit(limit).all()


def create_group(db: Session, group: GroupCreate) -> Group:
    db_group = Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    
    # Add leader as first member
    leader_member = GroupMember(
        group_id=db_group.id,
        student_id=group.leader_id,
        role="leader"
    )
    db.add(leader_member)
    db.commit()
    
    return db_group


def update_group(db: Session, group_id: int, group: GroupUpdate) -> Optional[Group]:
    db_group = get_group(db, group_id)
    if db_group:
        update_data = group.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_group, field, value)
        db.commit()
        db.refresh(db_group)
    return db_group


def delete_group(db: Session, group_id: int) -> bool:
    db_group = get_group(db, group_id)
    if db_group:
        db.delete(db_group)
        db.commit()
        return True
    return False


def add_group_member(db: Session, group_id: int, student_id: int) -> Optional[GroupMember]:
    db_group = get_group(db, group_id)
    if not db_group or db_group.current_members >= db_group.max_members:
        return None
    
    member = GroupMember(group_id=group_id, student_id=student_id, role="member")
    db.add(member)
    
    db_group.current_members += 1
    db.commit()
    db.refresh(member)
    return member


def remove_group_member(db: Session, group_id: int, student_id: int) -> bool:
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.student_id == student_id
    ).first()
    
    if member:
        db_group = get_group(db, group_id)
        db.delete(member)
        if db_group:
            db_group.current_members -= 1
        db.commit()
        return True
    return False


def create_invitation(db: Session, invitation: GroupInvitationCreate) -> GroupInvitation:
    db_invitation = GroupInvitation(**invitation.model_dump())
    db.add(db_invitation)
    db.commit()
    db.refresh(db_invitation)
    return db_invitation


def get_invitations_for_student(db: Session, student_id: int) -> List[GroupInvitation]:
    return db.query(GroupInvitation).filter(
        GroupInvitation.student_id == student_id
    ).all()


def update_invitation_status(db: Session, invitation_id: int, status: str) -> Optional[GroupInvitation]:
    invitation = db.query(GroupInvitation).filter(GroupInvitation.id == invitation_id).first()
    if invitation:
        invitation.status = status
        db.commit()
        db.refresh(invitation)
    return invitation

def create_join_request(db: Session, join_request: GroupJoinRequestCreate) -> GroupJoinRequest:
    db_request = GroupJoinRequest(**join_request.model_dump())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_join_requests_for_group(db: Session, group_id: int) -> List[GroupJoinRequest]:
    return db.query(GroupJoinRequest).filter(
        GroupJoinRequest.group_id == group_id,
        GroupJoinRequest.status == "pending"
    ).all()


def update_join_request_status(db: Session, request_id: int, status: str) -> Optional[GroupJoinRequest]:
    join_request = db.query(GroupJoinRequest).filter(GroupJoinRequest.id == request_id).first()
    if join_request:
        join_request.status = status
        db.commit()
        db.refresh(join_request)
    return join_request