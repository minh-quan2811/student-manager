import { apiClient } from './client';
import type { 
  LoginRequest, 
  LoginResponse, 
  User, 
  RegisterRequest,
  ProfessorProfileResponse,
  StudentProfileResponse 
} from './types';

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store token
    localStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  },

  // Register
  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // Get professor profile
  getProfessorProfile: async (): Promise<ProfessorProfileResponse> => {
    const response = await apiClient.get<ProfessorProfileResponse>('/auth/profile/professor');
    return response.data;
  },

  // Get student profile
  getStudentProfile: async (): Promise<StudentProfileResponse> => {
    const response = await apiClient.get<StudentProfileResponse>('/auth/profile/student');
    return response.data;
  },

  // Update professor profile
  updateProfessorProfile: async (data: {
    bio?: string;
    research_interests?: string[];
    total_slots?: number;
  }): Promise<ProfessorProfileResponse> => {
    const response = await apiClient.put<ProfessorProfileResponse>('/auth/profile/professor', data);
    return response.data;
  },

  // Update student profile
  updateStudentProfile: async (data: {
    bio?: string;
    skills?: string[];
    looking_for_group?: boolean;
  }): Promise<StudentProfileResponse> => {
    const response = await apiClient.put<StudentProfileResponse>('/auth/profile/student', data);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
  },
};