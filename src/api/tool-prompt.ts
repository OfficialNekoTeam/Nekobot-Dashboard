/**
 * 工具提示词相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

export interface ToolPrompt {
  tool_name: string;
  prompt: string;
  description: string;
}

/**
 * 获取所有工具提示词列表
 */
export async function getToolPrompts(): Promise<ApiResponse<{ tool_prompts: ToolPrompt[] }>> {
  const response = await apiClient.get<ApiResponse<{ tool_prompts: ToolPrompt[] }>>('/api/tool-prompts/list');
  return response.data;
}

/**
 * 创建新工具提示词
 */
export async function createToolPrompt(data: {
  tool_name: string;
  prompt: string;
  description?: string;
}): Promise<ApiResponse<{ tool_name: string }>> {
  const response = await apiClient.post<ApiResponse<{ tool_name: string }>>('/api/tool-prompts/create', data);
  return response.data;
}

/**
 * 更新工具提示词
 */
export async function updateToolPrompt(data: {
  tool_name: string;
  prompt?: string;
  description?: string;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/tool-prompts/update', data);
  return response.data;
}

/**
 * 删除工具提示词
 */
export async function deleteToolPrompt(data: {
  tool_name: string;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/tool-prompts/delete', data);
  return response.data;
}
