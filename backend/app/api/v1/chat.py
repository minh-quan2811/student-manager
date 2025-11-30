from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.chat import ChatMessage, ChatMessageCreate, ChatMessageUpdate, UnreadCountResponse
from app.crud import chat as crud_chat
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.professor import Professor
from app.models.group import Group, GroupMember
from app.models.group import group_mentors

router = APIRouter()


def get_user_access_to_group(db: Session, user: User, group_id: int) -> tuple:
    """
    Check if user has access to the group and return (has_access, user_type, user_profile_id)
    user_type: 'student' or 'professor'
    user_profile_id: the student.id or professor.id
    """
    # Check if user is a student member
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if student:
        member = db.query(GroupMember).filter(
            GroupMember.group_id == group_id,
            GroupMember.student_id == student.id
        ).first()
        if member:
            return (True, "student", student.id)
    
    # Check if user is a professor mentor
    professor = db.query(Professor).filter(Professor.user_id == user.id).first()
    if professor:
        mentor_record = db.execute(
            group_mentors.select().where(
                group_mentors.c.group_id == group_id,
                group_mentors.c.professor_id == professor.id
            )
        ).first()
        if mentor_record:
            return (True, "professor", professor.id)
    
    return (False, None, None)


@router.post("/groups/{group_id}/messages", response_model=ChatMessage, status_code=status.HTTP_201_CREATED)
def send_message(
    group_id: int,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to a group chat"""
    # Check group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check user has access to this group
    has_access, user_type, user_profile_id = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )
    
    # Create message
    message = crud_chat.create_message(db, group_id, user_profile_id, user_type, message_data)
    
    # Get sender name
    sender_name = current_user.name
    
    # Mark as read by sender
    crud_chat.mark_message_as_read(db, message.id, current_user.id)
    
    return {
        **message.__dict__,
        "sender_name": sender_name,
        "is_read": True
    }


@router.get("/groups/{group_id}/messages", response_model=List[ChatMessage])
def get_group_messages(
    group_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all messages for a group"""
    # Check group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check user has access to this group
    has_access, _, _ = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )
    
    # Get messages with sender details
    messages = crud_chat.get_messages(db, group_id, skip, limit, current_user.id)
    
    return messages


@router.put("/groups/{group_id}/messages/{message_id}", response_model=ChatMessage)
def update_message(
    group_id: int,
    message_id: int,
    message_data: ChatMessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a message (only by sender)"""
    # Get message
    message = crud_chat.get_message_by_id(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if message.group_id != group_id:
        raise HTTPException(status_code=400, detail="Message does not belong to this group")
    
    # Check user is the sender
    has_access, user_type, user_profile_id = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if message.sender_id != user_profile_id or message.sender_type != user_type:
        raise HTTPException(status_code=403, detail="You can only edit your own messages")
    
    # Update message
    updated_message = crud_chat.update_message(db, message_id, message_data)
    
    return {
        **updated_message.__dict__,
        "sender_name": current_user.name,
        "is_read": True
    }


@router.delete("/groups/{group_id}/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    group_id: int,
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a message (only by sender)"""
    # Get message
    message = crud_chat.get_message_by_id(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if message.group_id != group_id:
        raise HTTPException(status_code=400, detail="Message does not belong to this group")
    
    # Check user is the sender
    has_access, user_type, user_profile_id = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if message.sender_id != user_profile_id or message.sender_type != user_type:
        raise HTTPException(status_code=403, detail="You can only delete your own messages")
    
    # Delete message
    crud_chat.delete_message(db, message_id)
    
    return None


@router.post("/groups/{group_id}/messages/{message_id}/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_message_read(
    group_id: int,
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a message as read"""
    # Check access
    has_access, _, _ = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Mark as read
    crud_chat.mark_message_as_read(db, message_id, current_user.id)
    
    return None


@router.post("/groups/{group_id}/messages/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_messages_read(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all messages in a group as read"""
    # Check access
    has_access, _, _ = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Mark all as read
    crud_chat.mark_all_messages_as_read(db, group_id, current_user.id)
    
    return None


@router.get("/groups/{group_id}/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread messages for current user in a group"""
    # Check access
    has_access, _, _ = get_user_access_to_group(db, current_user, group_id)
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get unread count
    count = crud_chat.get_unread_count(db, group_id, current_user.id)
    
    return {
        "group_id": group_id,
        "unread_count": count
    }