/**
 * 热重载相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

/**
 * 触发热重载
 */
export async function triggerHotReload(): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/hot-reload/trigger');
  return response.data;
}

/**
 * 获取热重载状态
 */
export async function getHotReloadStatus(): Promise<ApiResponse<{ enabled: boolean }>> {
  const response = await apiClient.get<ApiResponse<{ enabled: boolean }>>(
    '/api/hot-reload/status'
  );
  return response.data;
}
