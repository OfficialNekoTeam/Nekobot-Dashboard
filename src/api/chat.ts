/**
 * 聊天相关 API
 */

import apiClient from './client';
import type {
  SendMessageRequest,
  NewSessionResponse,
  SessionsResponse,
  SessionDetail,
} from 'types/chat';
import type { ApiResponse } from 'types/api';

/**
 * 创建新会话
 */
export async function createNewSession(): Promise<ApiResponse<NewSessionResponse>> {
  const response = await apiClient.get<ApiResponse<NewSessionResponse>>('/chat/new_session');
  return response.data;
}

/**
 * 获取所有会话
 */
export async function getSessions(): Promise<ApiResponse<SessionsResponse>> {
  const response = await apiClient.get<ApiResponse<SessionsResponse>>('/chat/sessions');
  return response.data;
}

/**
 * 获取会话详情
 */
export async function getSession(sessionId: string): Promise<ApiResponse<SessionDetail>> {
  const response = await apiClient.get<ApiResponse<SessionDetail>>('/chat/get_session', {
    params: { session_id: sessionId },
  });
  return response.data;
}

/**
 * 删除会话
 */
export async function deleteSession(sessionId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/chat/delete_session', {
    session_id: sessionId,
  });
  return response.data;
}

/**
 * 发送消息 (返回 SSE 流)
 */
export function sendMessageStream(
  data: SendMessageRequest,
  onMessage: (text: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): () => void {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const signal = controller.signal;

  fetch(`${apiClient.defaults.baseURL}/chat/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is null');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim().startsWith('data:')) {
            const data = line.trim().slice(5).trim();
            if (data) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'plain' && parsed.text) {
                  onMessage(parsed.text);
                } else if (parsed.type === 'end') {
                  onComplete();
                } else if (parsed.type === 'error') {
                  onError(parsed.error || 'Unknown error');
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        onError(error.message);
      }
    });

  // 返回取消函数
  return () => controller.abort();
}
