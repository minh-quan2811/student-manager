import { apiClient } from './client';

export interface MentorshipRequestCreate {
  group_id: number;
  professor_id: number;
  requested_by: number;
  message: string;
}

export interface MentorshipRequestUpdate {
  status: 'accepted' | 'rejected';
  rejection_reason?: string;
}

export interface MentorshipRequest {
  id: number;
  group_id: number;
  professor_id: number;
  requested_by: number;
  message: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
  responded_at?: string;
}

export interface MentorshipRequestWithDetails extends MentorshipRequest {
  group_name: string;
  group_description: string;
  group_needed_skills: string[];
  requester_name: string;
  requester_email: string;
  professor_name: string;
}

export const mentorshipApi = {
  // Create a mentorship request
  create: async (request: MentorshipRequestCreate): Promise<MentorshipRequest> => {
    const response = await apiClient.post<MentorshipRequest>('/mentorship-requests/', request);
    return response.data;
  },

  // Get mentorship requests for a professor
  getForProfessor: async (professorId: number, status?: string): Promise<MentorshipRequestWithDetails[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<MentorshipRequestWithDetails[]>(
      `/mentorship-requests/professor/${professorId}`,
      { params }
    );
    return response.data;
  },

  // Get mentorship requests for a group
  getForGroup: async (groupId: number): Promise<MentorshipRequest[]> => {
    const response = await apiClient.get<MentorshipRequest[]>(
      `/mentorship-requests/group/${groupId}`
    );
    return response.data;
  },

  // Update mentorship request status (accept/reject)
  updateStatus: async (
    requestId: number,
    status: 'accepted' | 'rejected',
    rejectionReason?: string
  ): Promise<MentorshipRequest> => {
    const response = await apiClient.put<MentorshipRequest>(
      `/mentorship-requests/${requestId}/status`,
      { status, rejection_reason: rejectionReason }
    );
    return response.data;
  },

  // Withdraw a mentorship request
  withdraw: async (requestId: number): Promise<void> => {
    await apiClient.delete(`/mentorship-requests/${requestId}`);
  },
};