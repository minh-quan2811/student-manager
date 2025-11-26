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

  // Create professor profile (requires user_id)
  create: async (professor: ProfessorCreate): Promise<ProfessorWithUser> => {
    const response = await apiClient.post<ProfessorWithUser>('/professors/', professor);
    return response.data;
  },

  // Create professor account (user + profile in one call)
  createAccount: async (accountData: {
    name: string;
    email: string;
    password: string;
    professor_id: string;
    faculty: string;
    field: string;
    department: string;
    research_areas?: string[];
    research_interests?: string[];
    achievements?: string;
    publications?: number;
    bio?: string;
    total_slots?: number;
  }): Promise<ProfessorWithUser> => {
    // Step 1: Create user account
    const userResponse = await apiClient.post('/auth/register', {
      email: accountData.email,
      password: accountData.password,
      name: accountData.name,
      role: 'professor'
    });

    const user = userResponse.data;

    // Step 2: Create professor profile
    const professorResponse = await apiClient.post<ProfessorWithUser>('/professors/', {
      user_id: user.id,
      professor_id: accountData.professor_id,
      faculty: accountData.faculty,
      field: accountData.field,
      department: accountData.department,
      research_areas: accountData.research_areas || [],
      research_interests: accountData.research_interests || [],
      achievements: accountData.achievements || '',
      publications: accountData.publications || 0,
      bio: accountData.bio || '',
      available_slots: accountData.total_slots || 5,
      total_slots: accountData.total_slots || 5
    });

    return professorResponse.data;
  },

  // Bulk create professors from CSV data
  createBulk: async (professorsData: any[]): Promise<{
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
    }>('/professors/bulk', professorsData);

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