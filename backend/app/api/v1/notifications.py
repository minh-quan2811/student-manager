from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.notification import Notification, NotificationMarkRead, GroupJoinRequestAction, GroupInvitationAction
from app.models.notification import Notification as NotificationModel
from app.models.group import GroupJoinRequest as GroupJoinRequestModel, GroupMember, GroupInvitation
from app.models.student import Student
from app.api.deps import get_current_user
from app.models.user import User
from app.crud import group as crud_group

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
    """Accept or reject a group join request from notification"""
    # Get the notification
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == data.notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.type != "join_request":
        raise HTTPException(status_code=400, detail="Notification is not a group join request")
    
    # Get the join request using related_request_id
    join_request = db.query(GroupJoinRequestModel).filter(
        GroupJoinRequestModel.id == notification.related_request_id
    ).first()
    
    if not join_request:
        raise HTTPException(status_code=404, detail="Join request not found")
    
    # Verify the current user is the group leader
    group = join_request.group
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    if group.leader_id != current_user.id and current_user.role != "admin":
        if not student or student.id != group.leader_id:
            raise HTTPException(status_code=403, detail="Only the group leader can accept/reject join requests")
    
    if data.action.lower() == "accept":
        # Add student to group
        member = GroupMember(
            group_id=join_request.group_id,
            student_id=join_request.student_id,
            role="member"
        )
        db.add(member)
        
        # Update group member count
        group.current_members += 1
        
        # Update join request status
        join_request.status = "accepted"
        
        # Mark notification as read
        notification.read = True
        
        db.commit()
        
        # Create notification for the student who requested to join
        requesting_student = db.query(Student).filter(Student.id == join_request.student_id).first()
        if requesting_student:
            acceptance_notification = NotificationModel(
                user_id=requesting_student.user_id,
                type="join_request_accepted",
                title="Join Request Accepted",
                message=f"Your request to join {group.name} has been accepted",
                related_group_id=group.id,
                link=f"/student/groups/{group.id}"
            )
            db.add(acceptance_notification)
            db.commit()
        
        return {"message": "Join request accepted", "status": "accepted"}
    
    elif data.action.lower() == "reject":
        # Update join request status
        join_request.status = "rejected"
        
        # Mark notification as read
        notification.read = True
        
        db.commit()
        
        # Create notification for the student who requested to join
        requesting_student = db.query(Student).filter(Student.id == join_request.student_id).first()
        if requesting_student:
            rejection_notification = NotificationModel(
                user_id=requesting_student.user_id,
                type="join_request_rejected",
                title="Join Request Rejected",
                message=f"Your request to join {group.name} has been rejected",
                related_group_id=group.id,
                link=None
            )
            db.add(rejection_notification)
            db.commit()
        
        return {"message": "Join request rejected", "status": "rejected"}
    
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'accept' or 'reject'")


@router.post("/group-invitation/action")
def handle_group_invitation(
    data: GroupInvitationAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept or reject a group invitation from notification"""
    # Get the notification
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == data.notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.type != "group_invitation":
        raise HTTPException(status_code=400, detail="Notification is not a group invitation")
    
    # Get the invitation using related_request_id
    invitation = db.query(GroupInvitation).filter(
        GroupInvitation.id == notification.related_request_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Verify the current user is the invited student
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or student.id != invitation.student_id:
        raise HTTPException(status_code=403, detail="This invitation is not for you")
    
    group = invitation.group if hasattr(invitation, 'group') else crud_group.get_group(db, invitation.group_id)
    
    if data.action.lower() == "accept":
        # Add student to group
        member = GroupMember(
            group_id=invitation.group_id,
            student_id=invitation.student_id,
            role="member"
        )
        db.add(member)
        
        # Update group member count
        if group:
            group.current_members += 1
        
        # Update invitation status
        invitation.status = "accepted"
        
        # Mark notification as read
        notification.read = True
        
        db.commit()
        
        # Create notification for the group leader
        leader_student = db.query(Student).filter(Student.id == group.leader_id).first()
        if leader_student:
            acceptance_notification = NotificationModel(
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
        
        return {"message": "Invitation accepted", "status": "accepted"}
    
    elif data.action.lower() == "reject":
        # Update invitation status
        invitation.status = "rejected"
        
        # Mark notification as read
        notification.read = True
        
        db.commit()
        
        # Create notification for the group leader
        leader_student = db.query(Student).filter(Student.id == group.leader_id).first()
        if leader_student:
            rejection_notification = NotificationModel(
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
        
        return {"message": "Invitation rejected", "status": "rejected"}
    
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'accept' or 'reject'")
