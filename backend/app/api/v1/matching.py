from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.professor import Professor
from app.models.group import Group
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
import json
import os

router = APIRouter()

class MatchingRequest(BaseModel):
    query: str
    match_type: Optional[str] = None

class CandidateInfo(BaseModel):
    id: int
    name: str
    email: str
    type: str
    details: Dict[str, Any]

class MatchingResponse(BaseModel):
    selected_candidate: CandidateInfo
    candidates: List[CandidateInfo]
    reasoning: str
    match_type: str

def initialize_llm():
    api_key = os.getenv("GOOGLE_API_KEY")
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        google_api_key=api_key
    )

def extract_candidates_from_query(db: Session, query: str, llm) -> tuple[str, List[Dict[str, Any]]]:
    extraction_prompt = PromptTemplate(
        input_variables=["query"],
        template="""Analyze this user query and determine what type of person they need.
        
Query: {query}

Respond ONLY with valid JSON (no markdown, no extra text):
{{
  "match_type": "student" or "professor" or "group",
  "criteria": ["criteria1", "criteria2"],
  "priority": "high" or "medium" or "low"
}}

Match type should be:
- "student": if looking for a student to join their group
- "professor": if looking for a mentor/advisor
- "group": if looking to join a research group"""
    )
    
    chain = extraction_prompt | llm
    response = chain.invoke({"query": query})
    
    try:
        response_text = response.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
        analysis = json.loads(response_text)
    except (json.JSONDecodeError, IndexError):
        analysis = {"match_type": "student", "criteria": [], "priority": "medium"}
    
    match_type = analysis.get("match_type", "student").lower()
    candidates = []
    
    if match_type == "student":
        students = db.query(Student).join(User).all()
        for student in students:
            candidates.append({
                "id": student.id,
                "name": student.user.name,
                "email": student.user.email,
                "type": "student",
                "details": {
                    "gpa": student.gpa,
                    "major": student.major,
                    "year": student.year,
                    "skills": student.skills,
                    "bio": student.bio,
                    "looking_for_group": student.looking_for_group
                }
            })
    
    elif match_type == "professor":
        professors = db.query(Professor).join(User).all()
        for professor in professors:
            candidates.append({
                "id": professor.id,
                "name": professor.user.name,
                "email": professor.user.email,
                "type": "professor",
                "details": {
                    "department": professor.department,
                    "field": professor.field,
                    "research_areas": professor.research_areas,
                    "research_interests": professor.research_interests,
                    "bio": professor.bio,
                    "available_slots": professor.available_slots,
                    "total_slots": professor.total_slots,
                    "publications": professor.publications
                }
            })
    
    elif match_type == "group":
        groups = db.query(Group).all()
        for group in groups:
            leader = db.query(Student).filter(Student.id == group.leader_id).first()
            candidates.append({
                "id": group.id,
                "name": group.name,
                "email": leader.user.email if leader else "unknown",
                "type": "group",
                "details": {
                    "description": group.description,
                    "needed_skills": group.needed_skills,
                    "current_members": group.current_members,
                    "max_members": group.max_members,
                    "has_mentor": group.has_mentor,
                    "leader_name": leader.user.name if leader else "Unknown"
                }
            })
    
    return match_type, candidates[:10]

def select_best_candidate(query: str, candidates: List[Dict[str, Any]], match_type: str, llm) -> tuple[Dict[str, Any], str]:
    candidates_json = json.dumps(candidates, indent=2, default=str)
    
    selection_prompt = PromptTemplate(
        input_variables=["query", "candidates", "match_type"],
        template="""You are an AI matching system. A user has made this request:

Query: {query}

Here are the available {match_type}s to choose from:
{candidates}

Based on the query and the candidate information, select the BEST match.

Respond ONLY with valid JSON (no markdown, no extra text):
{{
  "selected_id": <the ID of the best candidate>,
  "reasoning": "<2-3 sentence explanation of why this candidate is the best match, using ONLY facts from their profile>"
}}

Consider:
- Skill alignment
- Experience level
- Availability
- Location/department relevance
- Research interests alignment"""
    )
    
    chain = selection_prompt | llm
    response = chain.invoke({
        "query": query,
        "candidates": candidates_json,
        "match_type": match_type
    })
    
    try:
        response_text = response.content.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
        result = json.loads(response_text)
    except (json.JSONDecodeError, IndexError):
        result = {"selected_id": candidates[0]["id"] if candidates else 0, "reasoning": "Selected based on availability."}
    
    selected_id = result.get("selected_id")
    reasoning = result.get("reasoning", "")
    
    selected_candidate = next((c for c in candidates if c["id"] == selected_id), candidates[0] if candidates else None)
    
    return selected_candidate, reasoning

@router.post("/match", response_model=MatchingResponse)
def find_best_match(
    request: MatchingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Find the best match for a user query using LLM analysis"""
    
    if not request.query or len(request.query.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query must be at least 5 characters long"
        )
    
    try:
        llm = initialize_llm()
        
        match_type, candidates = extract_candidates_from_query(db, request.query, llm)
        
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {match_type}s found in the database"
            )
        
        selected_candidate, reasoning = select_best_candidate(
            request.query,
            candidates,
            match_type,
            llm
        )
        
        if not selected_candidate:
            selected_candidate = candidates[0]
        
        return MatchingResponse(
            selected_candidate=CandidateInfo(
                id=selected_candidate["id"],
                name=selected_candidate["name"],
                email=selected_candidate["email"],
                type=selected_candidate["type"],
                details=selected_candidate["details"]
            ),
            candidates=[
                CandidateInfo(
                    id=c["id"],
                    name=c["name"],
                    email=c["email"],
                    type=c["type"],
                    details=c["details"]
                )
                for c in candidates
            ],
            reasoning=reasoning,
            match_type=match_type
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Matching service error: {str(e)}"
        )