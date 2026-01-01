/**
 * 会话管理相关 API
 */

import apiClient from './client';
import type {
  UserSession,
  SessionsListResponse,
  CreateSessionRequest,
  CreateSessionResponse,
} from 'types/session';
import type { ApiResponse } from 'types/api';

/**
 * 获取用户会话列表
 */
export async function getUserSessions(
  userId?: string,
  platformId?: string
): Promise<ApiResponse<SessionsListResponse>> {
  const response = await apiClient.get<ApiResponse<SessionsListResponse>>('/api/sessions', {
    params: { user_id: userId, platform_id: platformId },
  });
  return response.data;
}

/**
 * 创建会话
 */
export async function createSession(
  userId: string,
  platformId: string,
  data?: CreateSessionRequest
): Promise<ApiResponse<CreateSessionResponse>> {
  const response = await apiClient.post<ApiResponse<CreateSessionResponse>>('/api/sessions', data, {
    params: { user_id: userId, platform_id: platformId },
  });
  return response.data;
}

/**
 * 获取会话详情
 */
export async function getSession(sessionId: string): Promise<ApiResponse<UserSession>> {
  const response = await apiClient.get<ApiResponse<UserSession>>(`/api/sessions/${sessionId}`);
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
 * 更新会话摘要
 */
export async function updateSessionSummary(
  sessionId: string,
  summary: string
): Promise<ApiResponse<void>> {
  const response = await apiClient.put<ApiResponse<void>>(
    `/api/sessions/${sessionId}/summary`,
    { summary }
  );
  return response.data;
}

/**
 * 获取会话上下文
 */
export async function getSessionContext(
  sessionId: string,
  limit?: number
): Promise<ApiResponse<unknown>> {
  const response = await apiClient.get<ApiResponse<unknown>>(
    `/api/sessions/${sessionId}/context`,
    { params: { limit } }
  );
  return response.data;
}

/**
 * 获取会话统计
 */
export async function getSessionStats(sessionId: string): Promise<ApiResponse<unknown>> {
  const response = await apiClient.get<ApiResponse<unknown>>(
    `/api/sessions/${sessionId}/stats`
  );
  return response.data;
}

/**
 * 清除会话上下文
 */
export async function clearSessionContext(sessionId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `/api/sessions/${sessionId}/clear-context`
  );
  return response.data;
}
