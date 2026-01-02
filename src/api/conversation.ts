/**
 * 对话管理相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

/**
 * 对话信息类型
 */
export interface Conversation {
  id: string;
  session_id: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * 对话消息类型
 */
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

/**
 * 会话信息类型
 */
export interface Session {
  id: string;
  title?: string;
  conversation_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * 对话模板类型
 */
export interface ConversationTemplate {
  id: string;
  name: string;
  description?: string;
  system_prompt?: string;
  created_at: string;
}

/**
 * 对话统计类型
 */
export interface ConversationStats {
  total_conversations: number;
  total_messages: number;
  total_sessions: number;
}

/**
 * 获取对话列表
 */
export async function getConversations(
  sessionId?: string,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<{ conversations: Conversation[]; total: number }>> {
  const response = await apiClient.get<ApiResponse<{ conversations: Conversation[]; total: number }>>(
    '/api/conversations',
    {
      params: { session_id: sessionId, page, page_size: pageSize },
    }
  );
  return response.data;
}

/**
 * 创建对话
 */
export async function createConversation(
  sessionId: string,
  initialMessage?: string
): Promise<ApiResponse<Conversation>> {
  const response = await apiClient.post<ApiResponse<Conversation>>('/api/conversations', {
    session_id: sessionId,
    initial_message: initialMessage,
  });
  return response.data;
}

/**
 * 获取对话详情
 */
export async function getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
  const response = await apiClient.get<ApiResponse<Conversation>>(`/api/conversations/${conversationId}`);
  return response.data;
}

/**
 * 更新对话
 */
export async function updateConversation(
  conversationId: string,
  data: Partial<Conversation>
): Promise<ApiResponse<void>> {
  const response = await apiClient.put<ApiResponse<void>>(`/api/conversations/${conversationId}`, data);
  return response.data;
}

/**
 * 删除对话
 */
export async function deleteConversation(conversationId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/api/conversations/${conversationId}`);
  return response.data;
}

/**
 * 获取对话消息
 */
export async function getConversationMessages(
  conversationId: string,
  page = 1,
  pageSize = 50
): Promise<ApiResponse<{ messages: ConversationMessage[]; total: number }>> {
  const response = await apiClient.get<ApiResponse<{ messages: ConversationMessage[]; total: number }>>(
    `/api/conversations/${conversationId}/messages`,
    {
      params: { page, page_size: pageSize },
    }
  );
  return response.data;
}

/**
 * 添加对话消息
 */
export async function addConversationMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<ApiResponse<ConversationMessage>> {
  const response = await apiClient.post<ApiResponse<ConversationMessage>>(
    `/api/conversations/${conversationId}/messages`,
    {
      role,
      content,
    }
  );
  return response.data;
}

/**
 * 获取对话上下文
 */
export async function getConversationContext(
  conversationId: string
): Promise<ApiResponse<{ context: Record<string, any> }>> {
  const response = await apiClient.get<ApiResponse<{ context: Record<string, any> }>>(
    `/api/conversations/${conversationId}/context`
  );
  return response.data;
}

/**
 * 获取对话模板列表
 */
export async function getConversationTemplates(): Promise<ApiResponse<ConversationTemplate[]>> {
  const response = await apiClient.get<ApiResponse<ConversationTemplate[]>>('/api/conversations/templates');
  return response.data;
}

/**
 * 创建对话模板
 */
export async function createConversationTemplate(
  name: string,
  description?: string,
  systemPrompt?: string
): Promise<ApiResponse<ConversationTemplate>> {
  const response = await apiClient.post<ApiResponse<ConversationTemplate>>('/api/conversations/templates', {
    name,
    description,
    system_prompt: systemPrompt,
  });
  return response.data;
}

/**
 * 获取对话统计
 */
export async function getConversationStats(): Promise<ApiResponse<ConversationStats>> {
  const response = await apiClient.get<ApiResponse<ConversationStats>>('/api/conversations/stats');
  return response.data;
}

/**
 * 搜索对话
 */
export async function searchConversations(
  query: string,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<{ conversations: Conversation[]; total: number }>> {
  const response = await apiClient.post<ApiResponse<{ conversations: Conversation[]; total: number }>>(
    '/api/conversations/search',
    {
      query,
      page,
      page_size: pageSize,
    }
  );
  return response.data;
}

/**
 * 获取会话列表
 */
export async function getSessions(
  page = 1,
  pageSize = 10
): Promise<ApiResponse<{ sessions: Session[]; total: number }>> {
  const response = await apiClient.get<ApiResponse<{ sessions: Session[]; total: number }>>('/api/sessions', {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

/**
 * 获取会话详情
 */
export async function getSession(sessionId: string): Promise<ApiResponse<Session>> {
  const response = await apiClient.get<ApiResponse<Session>>(`/api/sessions/${sessionId}`);
  return response.data;
}

/**
 * 删除会话
 */
export async function deleteSession(sessionId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/api/sessions/${sessionId}`);
  return response.data;
}

/**
 * 切换会话的当前对话
 */
export async function switchConversation(
  sessionId: string,
  conversationId: string
): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(`/api/sessions/${sessionId}/switch`, {
    conversation_id: conversationId,
  });
  return response.data;
}
