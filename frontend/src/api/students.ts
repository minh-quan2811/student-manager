import { apiClient } from './client';
import type { StudentWithUser, StudentCreate, StudentUpdate, StudentQueryParams } from './types';

export const studentsApi = {
  // Get all students
  getAll: async (params?: StudentQueryParams): Promise<StudentWithUser[]> => {
    const response = await apiClient.get<StudentWithUser[]>('/students/', { params });
    return response.data;
  },

  // Get student by ID
  getById: async (id: number): Promise<StudentWithUser> => {
    const response = await apiClient.get<StudentWithUser>(`/students/${id}`);
    return response.data;
  },

  // Create student profile
  create: async (student: StudentCreate): Promise<StudentWithUser> => {
    const response = await apiClient.post<StudentWithUser>('/students/', student);
    return response.data;
  },

  // Create student account
  createAccount: async (accountData: {
    name: string;
    email: string;
    password: string;
    student_id: string;
    gpa: number;
    major: string;
    faculty: string;
    year: string;
    skills?: string[];
    bio?: string;
    looking_for_group?: boolean;
  }): Promise<StudentWithUser> => {
    // Create user account
    const userResponse = await apiClient.post('/auth/register', {
      email: accountData.email,
      password: accountData.password,
      name: accountData.name,
      role: 'student'
    });

    const user = userResponse.data;

    // Create student profile
    const studentResponse = await apiClient.post<StudentWithUser>('/students/', {
      user_id: user.id,
      student_id: accountData.student_id,
      gpa: accountData.gpa,
      major: accountData.major,
      faculty: accountData.faculty,
      year: accountData.year,
      skills: accountData.skills || [],
      bio: accountData.bio || '',
      looking_for_group: accountData.looking_for_group !== undefined ? accountData.looking_for_group : true
    });

    return studentResponse.data;
  },

  // Bulk create students from CSV data
  createBulk: async (studentsData: any[]): Promise<{
    success: number;
    failed: number;
    accounts: any[];
    errors: string[];
  }> => {
    const response = await apiClient.post<{
      success: number;
      failed: number;
      accounts: any[];
      errors: string[];
    }>('/students/bulk', studentsData);

    return response.data;
  },

  // Update student
  update: async (id: number, student: StudentUpdate): Promise<StudentWithUser> => {
    const response = await apiClient.put<StudentWithUser>(`/students/${id}`, student);
    return response.data;
  },

  // Delete student
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },

  // Search students
  search: async (params: StudentQueryParams): Promise<StudentWithUser[]> => {
    return studentsApi.getAll(params);
  },
};