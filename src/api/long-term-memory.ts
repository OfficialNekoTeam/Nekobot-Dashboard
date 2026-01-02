/**
 * 长期记忆管理相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

/**
 * 记忆类型
 */
export interface Memory {
  id: string;
  user_id?: string;
  key: string;
  value: any;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

/**
 * 记忆统计类型
 */
export interface MemoryStats {
  total_memories: number;
  total_users: number;
  total_size: number;
  size_formatted: string;
}

/**
 * 获取记忆列表
 */
export async function getMemories(
  userId?: string,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<{ memories: Memory[]; total: number }>> {
  const response = await apiClient.get<ApiResponse<{ memories: Memory[]; total: number }>>(
    '/api/long-term-memory/list',
    {
      params: { user_id: userId, page, page_size: pageSize },
    }
  );
  return response.data;
}

/**
 * 获取记忆详情
 */
export async function getMemory(memoryId: string): Promise<ApiResponse<Memory>> {
  const response = await apiClient.get<ApiResponse<Memory>>('/api/long-term-memory/get', {
    params: { id: memoryId },
  });
  return response.data;
}

/**
 * 根据键获取记忆
 */
export async function getMemoryByKey(
  key: string,
  userId?: string
): Promise<ApiResponse<Memory | null>> {
  const response = await apiClient.get<ApiResponse<Memory | null>>('/api/long-term-memory/get', {
    params: { key, user_id: userId },
  });
  return response.data;
}

/**
 * 设置记忆
 */
export async function setMemory(
  key: string,
  value: any,
  userId?: string,
  expiresAt?: string
): Promise<ApiResponse<Memory>> {
  const response = await apiClient.post<ApiResponse<Memory>>('/api/long-term-memory/set', {
    key,
    value,
    user_id: userId,
    expires_at: expiresAt,
  });
  return response.data;
}

/**
 * 删除记忆
 */
export async function deleteMemory(memoryId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/long-term-memory/delete', {
    id: memoryId,
  });
  return response.data;
}

/**
 * 根据键删除记忆
 */
export async function deleteMemoryByKey(key: string, userId?: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/long-term-memory/delete', {
    key,
    user_id: userId,
  });
  return response.data;
}

/**
 * 搜索记忆
 */
export async function searchMemories(
  query: string,
  userId?: string,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<{ memories: Memory[]; total: number }>> {
  const response = await apiClient.get<ApiResponse<{ memories: Memory[]; total: number }>>(
    '/api/long-term-memory/search',
    {
      params: { query, user_id: userId, page, page_size: pageSize },
    }
  );
  return response.data;
}

/**
 * 获取用户所有记忆
 */
export async function getUserMemories(
  userId: string
): Promise<ApiResponse<{ memories: Memory[]; total: number }>> {
  const response = await apiClient.get<ApiResponse<{ memories: Memory[]; total: number }>>(
    '/api/long-term-memory/user',
    {
      params: { user_id: userId },
    }
  );
  return response.data;
}

/**
 * 清除过期记忆
 */
export async function clearExpiredMemories(): Promise<ApiResponse<{ deleted_count: number }>> {
  const response = await apiClient.post<ApiResponse<{ deleted_count: number }>>(
    '/api/long-term-memory/clear-expired'
  );
  return response.data;
}

/**
 * 获取记忆统计
 */
export async function getMemoryStats(): Promise<ApiResponse<MemoryStats>> {
  const response = await apiClient.get<ApiResponse<MemoryStats>>('/api/long-term-memory/stats');
  return response.data;
}

/**
 * 批量设置记忆
 */
export async function batchSetMemories(
  memories: Array<{ key: string; value: any; user_id?: string }>
): Promise<ApiResponse<{ created: number; updated: number }>> {
  const response = await apiClient.post<ApiResponse<{ created: number; updated: number }>>(
    '/api/long-term-memory/batch-set',
    { memories }
  );
  return response.data;
}
