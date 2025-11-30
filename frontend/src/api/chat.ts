import { apiClient } from './client';

export interface ChatMessage {
  id: number;
  group_id: number;
  sender_id: number;
  sender_type: 'student' | 'professor';
  sender_name: string;
  message: string;
  created_at: string;
  edited_at?: string;
  is_deleted: boolean;
  is_read: boolean;
}

export interface ChatMessageCreate {
  message: string;
}

export interface ChatMessageUpdate {
  message: string;
}

export interface UnreadCountResponse {
  group_id: number;
  unread_count: number;
}

export const chatApi = {
  // Send a message
  sendMessage: async (groupId: number, message: string): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>(
      `/chat/groups/${groupId}/messages`,
      { message }
    );
    return response.data;
  },

  // Get all messages for a group
  getMessages: async (groupId: number, skip: number = 0, limit: number = 100): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(
      `/chat/groups/${groupId}/messages`,
      { params: { skip, limit } }
    );
    return response.data;
  },

  // Update a message
  updateMessage: async (groupId: number, messageId: number, message: string): Promise<ChatMessage> => {
    const response = await apiClient.put<ChatMessage>(
      `/chat/groups/${groupId}/messages/${messageId}`,
      { message }
    );
    return response.data;
  },

  // Delete a message
  deleteMessage: async (groupId: number, messageId: number): Promise<void> => {
    await apiClient.delete(`/chat/groups/${groupId}/messages/${messageId}`);
  },

  // Mark a message as read
  markAsRead: async (groupId: number, messageId: number): Promise<void> => {
    await apiClient.post(`/chat/groups/${groupId}/messages/${messageId}/read`);
  },

  // Mark all messages as read
  markAllAsRead: async (groupId: number): Promise<void> => {
    await apiClient.post(`/chat/groups/${groupId}/messages/read-all`);
  },

  // Get unread count
  getUnreadCount: async (groupId: number): Promise<UnreadCountResponse> => {
    const response = await apiClient.get<UnreadCountResponse>(
      `/chat/groups/${groupId}/unread-count`
    );
    return response.data;
  },
};