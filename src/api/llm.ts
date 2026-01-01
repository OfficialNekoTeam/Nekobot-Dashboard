/**
 * LLM 服务商相关 API
 */

import apiClient from './client';
import type {
  LLMProvider,
  ProviderType,
  AddProviderRequest,
  UpdateProviderRequest,
} from 'types/llm';
import type { ApiResponse } from 'types/api';

/**
 * 获取所有服务商
 */
export async function getProviders(): Promise<ApiResponse<{ providers: LLMProvider[] }>> {
  const response = await apiClient.get<ApiResponse<{ providers: LLMProvider[] }>>(
    '/api/llm/providers'
  );
  return response.data;
}

/**
 * 获取服务商类型
 */
export async function getProviderTypes(): Promise<ApiResponse<{ provider_types: ProviderType[] }>> {
  const response = await apiClient.get<ApiResponse<{ provider_types: ProviderType[] }>>(
    '/api/llm/providers/types'
  );
  return response.data;
}

/**
 * 添加服务商
 */
export async function addProvider(data: AddProviderRequest): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>(
    '/api/llm/providers/add',
    data
  );
  return response.data;
}

/**
 * 更新服务商
 */
export async function updateProvider(data: UpdateProviderRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/llm/providers/update', data);
  return response.data;
}

/**
 * 删除服务商
 */
export async function deleteProvider(id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/llm/providers/delete', { id });
  return response.data;
}
