from pydantic import BaseModel
from typing import List, Optional

class BulkAccountCreated(BaseModel):
    name: str
    student_id: Optional[str] = None
    professor_id: Optional[str] = None
    username: str
    password: str
    faculty: str

class BulkUploadResponse(BaseModel):
    success: int
    failed: int
    accounts: List[BulkAccountCreated]
    errors: List[str]