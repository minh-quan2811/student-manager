import { apiClient } from './client';
import type { Group, GroupCreate, GroupUpdate, GroupInvitation, GroupInvitationCreate } from './types';

export const groupsApi = {
  // Get all groups
  getAll: async (skip: number = 0, limit: number = 100): Promise<Group[]> => {
    const response = await apiClient.get<Group[]>('/groups/', { params: { skip, limit } });
    return response.data;
  },

  // Get group by ID
  getById: async (id: number): Promise<Group> => {
    const response = await apiClient.get<Group>(`/groups/${id}`);
    return response.data;
  },

  // Create group
  create: async (group: GroupCreate): Promise<Group> => {
    const response = await apiClient.post<Group>('/groups/', group);
    return response.data;
  },

  // Update group
  update: async (id: number, group: GroupUpdate): Promise<Group> => {
    const response = await apiClient.put<Group>(`/groups/${id}`, group);
    return response.data;
  },

  // Delete group
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/groups/${id}`);
  },

  // Add member to group
  addMember: async (groupId: number, studentId: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/groups/${groupId}/members/${studentId}`
    );
    return response.data;
  },

  // Remove member from group
  removeMember: async (groupId: number, studentId: number): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}/members/${studentId}`);
  },

  // Invitations
  invitations: {
    // Create invitation
    create: async (invitation: GroupInvitationCreate): Promise<GroupInvitation> => {
      const response = await apiClient.post<GroupInvitation>('/groups/invitations/', invitation);
      return response.data;
    },

    // Get invitations for a student
    getForStudent: async (studentId: number): Promise<GroupInvitation[]> => {
      const response = await apiClient.get<GroupInvitation[]>(
        `/groups/invitations/student/${studentId}`
      );
      return response.data;
    },

    // Update invitation status
    updateStatus: async (invitationId: number, status: string): Promise<{ message: string }> => {
      const response = await apiClient.put<{ message: string }>(
        `/groups/invitations/${invitationId}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    },
  },
};