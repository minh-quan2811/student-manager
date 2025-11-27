// User types
export type UserRole = 'admin' | 'student' | 'professor';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

// Student types
export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  gpa: number;
  major: string;
  faculty: string;
  year: string;
  skills: string[];
  bio?: string;
  looking_for_group: boolean;
}

export interface StudentWithUser extends Student {
  name: string;
  email: string;
}

export interface StudentCreate {
  user_id: number;
  student_id: string;
  gpa: number;
  major: string;
  faculty: string;
  year: string;
  skills: string[];
  bio?: string;
  looking_for_group: boolean;
}

export interface StudentUpdate {
  gpa?: number;
  major?: string;
  faculty?: string;
  year?: string;
  skills?: string[];
  bio?: string;
  looking_for_group?: boolean;
}

// Professor types
export interface Professor {
  id: number;
  user_id: number;
  professor_id: string;
  faculty: string;
  field: string;
  department: string;
  research_areas: string[];
  research_interests: string[];
  achievements?: string;
  publications: number;
  bio?: string;
  available_slots: number;
  total_slots: number;
}

export interface ProfessorWithUser extends Professor {
  name: string;
  email: string;
}

export interface ProfessorCreate {
  user_id: number;
  professor_id: string;
  faculty: string;
  field: string;
  department: string;
  research_areas: string[];
  research_interests?: string[];
  achievements?: string;
  publications?: number;
  bio?: string;
  available_slots?: number;
  total_slots?: number;
}

export interface ProfessorUpdate {
  faculty?: string;
  field?: string;
  department?: string;
  research_areas?: string[];
  research_interests?: string[];
  achievements?: string;
  publications?: number;
  bio?: string;
  available_slots?: number;
  total_slots?: number;
}

// Research Paper types
export interface ResearchPaper {
  id: number;
  paper_id: string;
  group_name: string;
  topic: string;
  description: string;
  abstract?: string;
  faculty: string;
  year: number;
  rank: number;
  members: number;
  leader: string;
  paper_path?: string;
}

export interface ResearchPaperCreate {
  paper_id: string;
  group_name: string;
  topic: string;
  description: string;
  abstract?: string;
  faculty: string;
  year: number;
  rank: number;
  members: number;
  leader: string;
  paper_path?: string;
  professor_ids?: number[];
}

export interface ResearchPaperUpdate {
  group_name?: string;
  topic?: string;
  description?: string;
  abstract?: string;
  faculty?: string;
  year?: number;
  rank?: number;
  members?: number;
  leader?: string;
  paper_path?: string;
  professor_ids?: number[];
}

// Group types
export interface Group {
  id: number;
  name: string;
  leader_id: number;
  description: string;
  needed_skills: string[];
  current_members: number;
  max_members: number;
  has_mentor: boolean;
  mentor_id?: number;
  created_at: string;
}

export interface GroupCreate {
  name: string;
  leader_id: number;
  description: string;
  needed_skills: string[];
  max_members: number;
}

export interface GroupUpdate {
  name?: string;
  description?: string;
  needed_skills?: string[];
  max_members?: number;
  has_mentor?: boolean;
  mentor_id?: number;
}

export interface GroupInvitation {
  id: number;
  group_id: number;
  student_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface GroupInvitationCreate {
  group_id: number;
  student_id: number;
  message: string;
}

// Query parameters
export interface StudentQueryParams {
  skip?: number;
  limit?: number;
  faculty?: string;
  year?: string;
  skill?: string;
  looking_for_group?: boolean;
}

export interface ProfessorQueryParams {
  skip?: number;
  limit?: number;
  faculty?: string;
  research_area?: string;
  available_only?: boolean;
}

export interface ResearchQueryParams {
  skip?: number;
  limit?: number;
  faculty?: string;
  year?: number;
}

export interface GroupJoinRequest {
  id: number;
  group_id: number;
  student_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface GroupJoinRequestCreate {
  group_id: number;
  student_id: number;
  message: string;
}