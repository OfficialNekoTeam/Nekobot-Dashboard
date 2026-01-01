/**
 * 平台管理相关 API
 */

import apiClient from './client';
import type {
  Platform,
  PlatformStats,
  AddPlatformRequest,
  UpdatePlatformRequest,
} from 'types/platform';
import type { ApiResponse } from 'types/api';

/**
 * 获取所有平台
 */
export async function getPlatforms(): Promise<ApiResponse<{ platforms: Platform[] }>> {
  const response = await apiClient.get<ApiResponse<{ platforms: Platform[] }>>(
    '/api/platforms/list'
  );
  return response.data;
}

/**
 * 获取平台统计
 */
export async function getPlatformStats(): Promise<ApiResponse<PlatformStats>> {
  const response = await apiClient.get<ApiResponse<PlatformStats>>('/api/platforms/stats');
  return response.data;
}

/**
 * 添加平台
 */
export async function addPlatform(data: AddPlatformRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/platforms/add', data);
  return response.data;
}

/**
 * 更新平台
 */
export async function updatePlatform(data: UpdatePlatformRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/platforms/update', data);
  return response.data;
}

/**
 * 删除平台
 */
export async function deletePlatform(type: string, id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/platforms/delete', {
    type,
    id,
  });
  return response.data;
}
