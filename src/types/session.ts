/**
 * 会话相关类型
 */

/** 用户会话 */
export interface UserSession {
  session_id: string;
  user_id: string;
  platform_id: string;
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** 会话列表响应 */
export interface SessionsListResponse {
  sessions: UserSession[];
}

/** 创建会话请求 */
export interface CreateSessionRequest {
  summary?: string;
  metadata?: Record<string, unknown>;
}

/** 创建会话响应 */
export interface CreateSessionResponse {
  session_id: string;
  messages: unknown[];
}
