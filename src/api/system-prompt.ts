/**
 * 系统提示词相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

export interface SystemPrompt {
  name: string;
  prompt: string;
  description: string;
}

/**
 * 获取所有系统提示词列表
 */
export async function getSystemPrompts(): Promise<ApiResponse<{ system_prompts: SystemPrompt[] }>> {
  const response = await apiClient.get<ApiResponse<{ system_prompts: SystemPrompt[] }>>('/api/system-prompts/list');
  return response.data;
}

/**
 * 创建新系统提示词
 */
export async function createSystemPrompt(data: {
  name: string;
  prompt: string;
  description?: string;
}): Promise<ApiResponse<{ name: string }>> {
  const response = await apiClient.post<ApiResponse<{ name: string }>>('/api/system-prompts/create', data);
  return response.data;
}

/**
 * 更新系统提示词
 */
export async function updateSystemPrompt(data: {
  name: string;
  prompt?: string;
  description?: string;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/system-prompts/update', data);
  return response.data;
}

/**
 * 删除系统提示词
 */
export async function deleteSystemPrompt(data: {
  name: string;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/system-prompts/delete', data);
  return response.data;
}
