from sqlalchemy.orm import Session
from app.models.chat import GroupChatMessage, MessageReadStatus
from app.models.student import Student
from app.models.professor import Professor
from app.schemas.chat import ChatMessageCreate, ChatMessageUpdate
from typing import List, Optional
from datetime import datetime


def create_message(
    db: Session, 
    group_id: int, 
    sender_id: int, 
    sender_type: str, 
    message_data: ChatMessageCreate
) -> GroupChatMessage:
    """Create a new chat message"""
    db_message = GroupChatMessage(
        group_id=group_id,
        sender_id=sender_id,
        sender_type=sender_type,
        message=message_data.message
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_messages(
    db: Session, 
    group_id: int, 
    skip: int = 0, 
    limit: int = 100,
    current_user_id: int = None
) -> List[dict]:
    """Get all messages for a group with sender details and read status"""
    messages = db.query(GroupChatMessage).filter(
        GroupChatMessage.group_id == group_id,
        GroupChatMessage.is_deleted == False
    ).order_by(GroupChatMessage.created_at.asc()).offset(skip).limit(limit).all()
    
    result = []
    for msg in messages:
        # Get sender name based on sender type
        sender_name = "Unknown"
        if msg.sender_type == "student":
            student = db.query(Student).filter(Student.id == msg.sender_id).first()
            if student:
                sender_name = student.user.name
        elif msg.sender_type == "professor":
            professor = db.query(Professor).filter(Professor.id == msg.sender_id).first()
            if professor:
                sender_name = professor.user.name
        
        # Check if current user has read this message
        is_read = False
        if current_user_id:
            read_status = db.query(MessageReadStatus).filter(
                MessageReadStatus.message_id == msg.id,
                MessageReadStatus.user_id == current_user_id
            ).first()
            is_read = read_status is not None
        
        result.append({
            "id": msg.id,
            "group_id": msg.group_id,
            "sender_id": msg.sender_id,
            "sender_type": msg.sender_type,
            "sender_name": sender_name,
            "message": msg.message,
            "created_at": msg.created_at,
            "edited_at": msg.edited_at,
            "is_deleted": msg.is_deleted,
            "is_read": is_read
        })
    
    return result


def get_message_by_id(db: Session, message_id: int) -> Optional[GroupChatMessage]:
    """Get a single message by ID"""
    return db.query(GroupChatMessage).filter(GroupChatMessage.id == message_id).first()


def update_message(
    db: Session, 
    message_id: int, 
    message_data: ChatMessageUpdate
) -> Optional[GroupChatMessage]:
    """Update a message"""
    message = get_message_by_id(db, message_id)
    if message:
        message.message = message_data.message
        message.edited_at = datetime.utcnow()
        db.commit()
        db.refresh(message)
    return message


def delete_message(db: Session, message_id: int) -> bool:
    """Soft delete a message"""
    message = get_message_by_id(db, message_id)
    if message:
        message.is_deleted = True
        message.message = "[Message deleted]"
        db.commit()
        return True
    return False


def mark_message_as_read(db: Session, message_id: int, user_id: int) -> MessageReadStatus:
    """Mark a message as read by a user"""
    # Check if already marked as read
    existing = db.query(MessageReadStatus).filter(
        MessageReadStatus.message_id == message_id,
        MessageReadStatus.user_id == user_id
    ).first()
    
    if existing:
        return existing
    
    read_status = MessageReadStatus(
        message_id=message_id,
        user_id=user_id
    )
    db.add(read_status)
    db.commit()
    db.refresh(read_status)
    return read_status


def mark_all_messages_as_read(db: Session, group_id: int, user_id: int) -> int:
    """Mark all messages in a group as read for a user"""
    messages = db.query(GroupChatMessage).filter(
        GroupChatMessage.group_id == group_id,
        GroupChatMessage.is_deleted == False
    ).all()
    
    count = 0
    for message in messages:
        # Check if already marked
        existing = db.query(MessageReadStatus).filter(
            MessageReadStatus.message_id == message.id,
            MessageReadStatus.user_id == user_id
        ).first()
        
        if not existing:
            read_status = MessageReadStatus(
                message_id=message.id,
                user_id=user_id
            )
            db.add(read_status)
            count += 1
    
    db.commit()
    return count


def get_unread_count(db: Session, group_id: int, user_id: int) -> int:
    """Get count of unread messages for a user in a group"""
    # Get all messages in group
    all_messages = db.query(GroupChatMessage.id).filter(
        GroupChatMessage.group_id == group_id,
        GroupChatMessage.is_deleted == False
    ).all()
    
    message_ids = [msg.id for msg in all_messages]
    
    # Get messages user has read
    read_messages = db.query(MessageReadStatus.message_id).filter(
        MessageReadStatus.message_id.in_(message_ids),
        MessageReadStatus.user_id == user_id
    ).all()
    
    read_message_ids = [rm.message_id for rm in read_messages]
    
    # Count unread
    unread_count = len(message_ids) - len(read_message_ids)
    return unread_count