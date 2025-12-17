from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.group import GroupMember, GroupJoinRequest, GroupInvitation, Group
from app.models.student import Student
from app.schemas.notification import NotificationCreate
from typing import Optional


def create_notification(db: Session, notification: NotificationCreate) -> Notification:
    """Create a notification - centralized logic"""
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def accept_join_request(
    db: Session,
    join_request: GroupJoinRequest,
    notification: Notification
) -> tuple[GroupMember, Notification]:
    """
    Accept a join request - handles all business logic in one transaction.
    Returns (member, acceptance_notification)
    """
    # Add student to group
    member = GroupMember(
        group_id=join_request.group_id,
        student_id=join_request.student_id,
        role="member"
    )
    db.add(member)
    
    # Update group member count
    group = db.query(Group).filter(Group.id == join_request.group_id).first()
    if group:
        group.current_members += 1
    
    # Update join request status
    join_request.status = "accepted"
    
    # Mark original notification as read
    notification.read = True
    
    # Create acceptance notification for requester
    requesting_student = db.query(Student).filter(
        Student.id == join_request.student_id
    ).first()
    
    acceptance_notification = None
    if requesting_student and group:
        acceptance_notification = Notification(
            user_id=requesting_student.user_id,
            type="join_request_accepted",
            title="Join Request Accepted",
            message=f"Your request to join {group.name} has been accepted",
            related_group_id=group.id,
            link=f"/student/groups/{group.id}"
        )
        db.add(acceptance_notification)
    
    db.commit()
    db.refresh(member)
    if acceptance_notification:
        db.refresh(acceptance_notification)
    
    return member, acceptance_notification


def reject_join_request(
    db: Session,
    join_request: GroupJoinRequest,
    notification: Notification
) -> Optional[Notification]:
    """
    Reject a join request - handles all business logic in one transaction.
    Returns rejection notification.
    """
    # Update join request status
    join_request.status = "rejected"
    
    # Mark original notification as read
    notification.read = True
    
    # Create rejection notification for requester
    requesting_student = db.query(Student).filter(
        Student.id == join_request.student_id
    ).first()
    
    group = db.query(Group).filter(Group.id == join_request.group_id).first()
    
    rejection_notification = None
    if requesting_student and group:
        rejection_notification = Notification(
            user_id=requesting_student.user_id,
            type="join_request_rejected",
            title="Join Request Rejected",
            message=f"Your request to join {group.name} has been rejected",
            related_group_id=group.id,
            link=None
        )
        db.add(rejection_notification)
    
    db.commit()
    if rejection_notification:
        db.refresh(rejection_notification)
    
    return rejection_notification


def accept_invitation(
    db: Session,
    invitation: GroupInvitation,
    notification: Notification,
    student: Student
) -> tuple[GroupMember, Notification]:
    """
    Accept a group invitation - handles all business logic in one transaction.
    Returns (member, acceptance_notification)
    """
    # Add student to group
    member = GroupMember(
        group_id=invitation.group_id,
        student_id=invitation.student_id,
        role="member"
    )
    db.add(member)
    
    # Update group member count
    group = db.query(Group).filter(Group.id == invitation.group_id).first()
    if group:
        group.current_members += 1
    
    # Update invitation status
    invitation.status = "accepted"
    
    # Mark original notification as read
    notification.read = True
    
    # Create acceptance notification for leader
    leader_student = db.query(Student).filter(Student.id == group.leader_id).first()
    
    acceptance_notification = None
    if leader_student and group:
        acceptance_notification = Notification(
            user_id=leader_student.user_id,
            type="invitation_accepted",
            title="Invitation Accepted",
            message=f"{student.user.name} has accepted your invitation to join {group.name}",
            related_group_id=group.id,
            related_student_id=student.id,
            link=f"/student/mygroups"
        )
        db.add(acceptance_notification)
    
    db.commit()
    db.refresh(member)
    if acceptance_notification:
        db.refresh(acceptance_notification)
    
    return member, acceptance_notification


def reject_invitation(
    db: Session,
    invitation: GroupInvitation,
    notification: Notification,
    student: Student
) -> Optional[Notification]:
    """
    Reject a group invitation - handles all business logic in one transaction.
    Returns rejection notification.
    """
    # Update invitation status
    invitation.status = "rejected"
    
    # Mark original notification as read
    notification.read = True
    
    # Create rejection notification for leader
    group = db.query(Group).filter(Group.id == invitation.group_id).first()
    leader_student = db.query(Student).filter(Student.id == group.leader_id).first()
    
    rejection_notification = None
    if leader_student and group:
        rejection_notification = Notification(
            user_id=leader_student.user_id,
            type="invitation_rejected",
            title="Invitation Rejected",
            message=f"{student.user.name} has rejected your invitation to join {group.name}",
            related_group_id=group.id,
            related_student_id=student.id,
            link=None
        )
        db.add(rejection_notification)
    
    db.commit()
    if rejection_notification:
        db.refresh(rejection_notification)
    
    return rejection_notification