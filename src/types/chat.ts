/**
 * 聊天相关类型
 */

/** 聊天消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system';

/** 聊天消息 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: string;
}

/** SSE 事件类型 */
export type SSEEventType = 'plain' | 'end' | 'error';

/** SSE 事件数据 */
export interface SSEEvent {
  type: SSEEventType;
  text?: string;
  error?: string;
}

/** 发送消息请求 */
export interface SendMessageRequest {
  message: string;
  session_id: string;
  selected_provider?: string;
  selected_model?: string;
  enable_streaming?: boolean;
}

/** 会话信息 */
export interface ChatSession {
  id: string;
  creator: string;
  created_at: string;
  message_count: number;
  summary?: string;
}

/** 会话详情 */
export interface SessionDetail {
  session: ChatSession;
  messages: ChatMessage[];
  is_running: boolean;
}

/** 新建会话响应 */
export interface NewSessionResponse {
  session_id: string;
}

/** 会话列表响应 */
export interface SessionsResponse {
  sessions: ChatSession[];
}
