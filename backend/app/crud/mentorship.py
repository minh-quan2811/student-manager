from sqlalchemy.orm import Session, joinedload
from app.models.mentorship_request import MentorshipRequest
from app.models.group import Group
from app.models.student import Student
from app.models.professor import Professor
from app.schemas.mentorship import MentorshipRequestCreate, MentorshipRequestUpdate
from typing import List, Optional
from datetime import datetime


def create_mentorship_request(db: Session, request_data: MentorshipRequestCreate) -> MentorshipRequest:
    """Create a new mentorship request"""
    db_request = MentorshipRequest(**request_data.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_mentorship_request(db: Session, request_id: int) -> Optional[MentorshipRequest]:
    """Get a single mentorship request by ID"""
    return db.query(MentorshipRequest).filter(MentorshipRequest.id == request_id).first()


def get_mentorship_requests_for_professor(
    db: Session, 
    professor_id: int, 
    status: Optional[str] = None
) -> List[MentorshipRequest]:
    """Get all mentorship requests for a professor, optionally filtered by status"""
    query = db.query(MentorshipRequest).filter(
        MentorshipRequest.professor_id == professor_id
    ).options(
        joinedload(MentorshipRequest.group),
        joinedload(MentorshipRequest.requester).joinedload(Student.user)
    )
    
    if status:
        query = query.filter(MentorshipRequest.status == status)
    
    return query.order_by(MentorshipRequest.created_at.desc()).all()


def get_mentorship_requests_for_group(
    db: Session, 
    group_id: int,
    status: Optional[str] = None
) -> List[MentorshipRequest]:
    """Get all mentorship requests for a group"""
    query = db.query(MentorshipRequest).filter(
        MentorshipRequest.group_id == group_id
    ).options(
        joinedload(MentorshipRequest.professor).joinedload(Professor.user)
    )
    
    if status:
        query = query.filter(MentorshipRequest.status == status)
    
    return query.order_by(MentorshipRequest.created_at.desc()).all()


def get_active_requests_count_for_group(db: Session, group_id: int) -> int:
    """Count pending mentorship requests for a group"""
    return db.query(MentorshipRequest).filter(
        MentorshipRequest.group_id == group_id,
        MentorshipRequest.status == 'pending'
    ).count()


def get_pending_request_to_professor(
    db: Session, 
    group_id: int, 
    professor_id: int
) -> Optional[MentorshipRequest]:
    """Check if there's already a pending request from this group to this professor"""
    return db.query(MentorshipRequest).filter(
        MentorshipRequest.group_id == group_id,
        MentorshipRequest.professor_id == professor_id,
        MentorshipRequest.status == 'pending'
    ).first()


def update_mentorship_request_status(
    db: Session, 
    request_id: int, 
    status: str,
    rejection_reason: Optional[str] = None
) -> Optional[MentorshipRequest]:
    """Update the status of a mentorship request"""
    request = get_mentorship_request(db, request_id)
    if request:
        request.status = status
        request.responded_at = datetime.utcnow()
        if rejection_reason:
            request.rejection_reason = rejection_reason
        db.commit()
        db.refresh(request)
    return request


def reject_other_pending_requests_for_group(db: Session, group_id: int, accepted_request_id: int):
    """Reject all other pending requests for a group when one is accepted"""
    db.query(MentorshipRequest).filter(
        MentorshipRequest.group_id == group_id,
        MentorshipRequest.status == 'pending',
        MentorshipRequest.id != accepted_request_id
    ).update({
        'status': 'rejected',
        'rejection_reason': 'Another professor was selected as mentor for this group.',
        'responded_at': datetime.utcnow()
    }, synchronize_session=False)
    db.commit()