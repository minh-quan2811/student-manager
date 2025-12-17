from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.notification import (
    Notification, NotificationMarkRead, 
    GroupJoinRequestAction, GroupInvitationAction
)
from app.models.notification import Notification as NotificationModel
from app.models.group import GroupJoinRequest, GroupInvitation
from app.models.student import Student
from app.api.deps import get_current_user
from app.models.user import User
from app.crud import notification as crud_notification

router = APIRouter()


@router.get("/", response_model=List[Notification])
def get_my_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get notifications for current user"""
    query = db.query(NotificationModel).filter(
        NotificationModel.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(NotificationModel.read == False)
    
    notifications = query.order_by(
        NotificationModel.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return notifications


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread notifications"""
    count = db.query(NotificationModel).filter(
        NotificationModel.user_id == current_user.id,
        NotificationModel.read == False
    ).count()
    
    return {"count": count}


@router.put("/mark-read")
def mark_notifications_read(
    data: NotificationMarkRead,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark notifications as read"""
    db.query(NotificationModel).filter(
        NotificationModel.id.in_(data.notification_ids),
        NotificationModel.user_id == current_user.id
    ).update({"read": True}, synchronize_session=False)
    
    db.commit()
    
    return {"message": "Notifications marked as read"}


@router.put("/{notification_id}/mark-read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a single notification as read"""
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    db.commit()
    
    return {"message": "Notification marked as read"}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a notification"""
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted"}


@router.post("/group-join-request/action")
def handle_group_join_request(
    data: GroupJoinRequestAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept or reject a group join request - uses CRUD layer for business logic"""
    # Get the notification
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == data.notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.type != "join_request":
        raise HTTPException(status_code=400, detail="Notification is not a group join request")
    
    # Get the join request
    join_request = db.query(GroupJoinRequest).filter(
        GroupJoinRequest.id == notification.related_request_id
    ).first()
    
    if not join_request:
        raise HTTPException(status_code=404, detail="Join request not found")
    
    # Verify authorization - current user must be group leader
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if current_user.role != "admin":
        if not student or student.id != join_request.group.leader_id:
            raise HTTPException(
                status_code=403,
                detail="Only the group leader can accept/reject join requests"
            )
    
    # Process the action using CRUD layer
    if data.action.lower() == "accept":
        crud_notification.accept_join_request(db, join_request, notification)
        return {"message": "Join request accepted", "status": "accepted"}
    elif data.action.lower() == "reject":
        crud_notification.reject_join_request(db, join_request, notification)
        return {"message": "Join request rejected", "status": "rejected"}
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'accept' or 'reject'")


@router.post("/group-invitation/action")
def handle_group_invitation(
    data: GroupInvitationAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept or reject a group invitation - uses CRUD layer for business logic"""
    # Get the notification
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == data.notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.type != "group_invitation":
        raise HTTPException(status_code=400, detail="Notification is not a group invitation")
    
    # Get the invitation
    invitation = db.query(GroupInvitation).filter(
        GroupInvitation.id == notification.related_request_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Verify authorization - current user must be the invited student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or student.id != invitation.student_id:
        raise HTTPException(status_code=403, detail="This invitation is not for you")
    
    # Process the action using CRUD layer
    if data.action.lower() == "accept":
        crud_notification.accept_invitation(db, invitation, notification, student)
        return {"message": "Invitation accepted", "status": "accepted"}
    elif data.action.lower() == "reject":
        crud_notification.reject_invitation(db, invitation, notification, student)
        return {"message": "Invitation rejected", "status": "rejected"}
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'accept' or 'reject'")