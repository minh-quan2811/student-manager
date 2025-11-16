import { apiClient } from './client';
import type { ResearchPaper, ResearchPaperCreate, ResearchPaperUpdate, ResearchQueryParams } from './types';

export const researchApi = {
  // Get all research papers
  getAll: async (params?: ResearchQueryParams): Promise<ResearchPaper[]> => {
    const response = await apiClient.get<ResearchPaper[]>('/research/', { params });
    return response.data;
  },

  // Get research paper by ID
  getById: async (id: number): Promise<ResearchPaper> => {
    const response = await apiClient.get<ResearchPaper>(`/research/${id}`);
    return response.data;
  },

  // Create research paper
  create: async (paper: ResearchPaperCreate): Promise<ResearchPaper> => {
    const response = await apiClient.post<ResearchPaper>('/research/', paper);
    return response.data;
  },

  // Update research paper
  update: async (id: number, paper: ResearchPaperUpdate): Promise<ResearchPaper> => {
    const response = await apiClient.put<ResearchPaper>(`/research/${id}`, paper);
    return response.data;
  },

  // Delete research paper
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/research/${id}`);
  },

  // Search research papers
  search: async (params: ResearchQueryParams): Promise<ResearchPaper[]> => {
    return researchApi.getAll(params);
  },
};