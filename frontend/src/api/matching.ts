import { apiClient } from './client';

export interface CandidateDetails {
  [key: string]: any;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  type: 'student' | 'professor' | 'group';
  details: CandidateDetails;
}

export interface MatchingResult {
  selected_candidate: Candidate;
  candidates: Candidate[];
  reasoning: string;
  match_type: 'student' | 'professor' | 'group';
}

export const matchingApi = {
  findBestMatch: async (query: string): Promise<MatchingResult> => {
    const response = await apiClient.post<MatchingResult>('/matching/match', {
      query,
      match_type: null
    });
    return response.data;
  }
};