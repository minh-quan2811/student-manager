import { apiClient } from './client';

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  related_group_id?: number;
  related_student_id?: number;
  related_request_id?: number;
}

export const notificationsApi = {
  // Get all notifications
  getAll: async (skip: number = 0, limit: number = 50, unreadOnly: boolean = false): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications/', {
      params: { skip, limit, unread_only: unreadOnly }
    });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },

  // Mark notifications as read
  markRead: async (notificationIds: number[]): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>('/notifications/mark-read', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  // Mark single notification as read
  markOneRead: async (notificationId: number): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(
      `/notifications/${notificationId}/mark-read`
    );
    return response.data;
  },

  // Delete notification
  delete: async (notificationId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/notifications/${notificationId}`
    );
    return response.data;
  },

  // Handle group invitation action (accept/reject)
  handleGroupInvitation: async (notificationId: number, action: 'accept' | 'reject'): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{ message: string; status: string }>(
      '/notifications/group-invitation/action',
      { notification_id: notificationId, action }
    );
    return response.data;
  },

  // Handle group join request action (accept/reject)
  handleGroupJoinRequest: async (notificationId: number, action: 'accept' | 'reject'): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{ message: string; status: string }>(
      '/notifications/group-join-request/action',
      { notification_id: notificationId, action }
    );
    return response.data;
  }
};