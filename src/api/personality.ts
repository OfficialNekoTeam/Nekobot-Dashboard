/**
 * 人格管理相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

export interface Personality {
  name: string;
  prompt: string;
  description: string;
  enabled: boolean;
}

/**
 * 获取所有人设列表
 */
export async function getPersonalities(): Promise<ApiResponse<{ personalities: Personality[] }>> {
  const response = await apiClient.get<ApiResponse<{ personalities: Personality[] }>>('/api/personalities/list');
  return response.data;
}

/**
 * 创建新人设
 */
export async function createPersonality(data: {
  name: string;
  description: string;
  prompt: string;
  enabled?: boolean;
}): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>('/api/personalities/create', data);
  return response.data;
}

/**
 * 更新人设
 */
export async function updatePersonality(data: {
  id?: string;
  name?: string;
  description?: string;
  prompt?: string;
  enabled?: boolean;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/personalities/update', data);
  return response.data;
}

/**
 * 删除人设
 */
export async function deletePersonality(data: {
  id?: string;
  name?: string;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/personalities/delete', data);
  return response.data;
}
