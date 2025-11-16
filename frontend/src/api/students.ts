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

  // Create student
  create: async (student: StudentCreate): Promise<StudentWithUser> => {
    const response = await apiClient.post<StudentWithUser>('/students/', student);
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