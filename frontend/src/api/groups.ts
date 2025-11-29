// frontend/src/api/groups.ts
import { apiClient } from './client';
import type { Group, GroupCreate, GroupUpdate, GroupInvitation, GroupInvitationCreate, GroupJoinRequest, GroupJoinRequestCreate } from './types';

export interface GroupMember {
  id: number;
  group_id: number;
  student_id: number;
  role: string;
  joined_at: string;
}

export const groupsApi = {
  // Get all groups
  getAll: async (skip: number = 0, limit: number = 100): Promise<Group[]> => {
    const response = await apiClient.get<Group[]>('/groups/', { params: { skip, limit } });
    return response.data;
  },

  // Get my groups
  getMyGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get<Group[]>('/groups/my-groups');
    return response.data;
  },

  // Get group by ID
  getById: async (id: number): Promise<Group> => {
    const response = await apiClient.get<Group>(`/groups/${id}`);
    return response.data;
  },

  // Get group members
  getMembers: async (groupId: number): Promise<GroupMember[]> => {
    const response = await apiClient.get<GroupMember[]>(`/groups/${groupId}/members`);
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

  joinRequests: {
    // Create join request
    create: async (request: GroupJoinRequestCreate): Promise<GroupJoinRequest> => {
      const response = await apiClient.post<GroupJoinRequest>('/groups/join-requests/', request);
      return response.data;
    },

    // Get join requests for a group (leader only)
    getForGroup: async (groupId: number): Promise<GroupJoinRequest[]> => {
      const response = await apiClient.get<GroupJoinRequest[]>(
        `/groups/join-requests/group/${groupId}`
      );
      return response.data;
    },

    // Update join request status
    updateStatus: async (requestId: number, status: string): Promise<{ message: string }> => {
      const response = await apiClient.put<{ message: string }>(
        `/groups/join-requests/${requestId}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    },
  },
};