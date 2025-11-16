import { apiClient } from './client';
import type { ProfessorWithUser, ProfessorCreate, ProfessorUpdate, ProfessorQueryParams } from './types';

export const professorsApi = {
  // Get all professors
  getAll: async (params?: ProfessorQueryParams): Promise<ProfessorWithUser[]> => {
    const response = await apiClient.get<ProfessorWithUser[]>('/professors/', { params });
    return response.data;
  },

  // Get professor by ID
  getById: async (id: number): Promise<ProfessorWithUser> => {
    const response = await apiClient.get<ProfessorWithUser>(`/professors/${id}`);
    return response.data;
  },

  // Create professor
  create: async (professor: ProfessorCreate): Promise<ProfessorWithUser> => {
    const response = await apiClient.post<ProfessorWithUser>('/professors/', professor);
    return response.data;
  },

  // Update professor
  update: async (id: number, professor: ProfessorUpdate): Promise<ProfessorWithUser> => {
    const response = await apiClient.put<ProfessorWithUser>(`/professors/${id}`, professor);
    return response.data;
  },

  // Delete professor
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/professors/${id}`);
  },

  // Search professors
  search: async (params: ProfessorQueryParams): Promise<ProfessorWithUser[]> => {
    return professorsApi.getAll(params);
  },
};