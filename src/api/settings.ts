/**
 * 设置相关 API
 */

import apiClient from './client';
import type { SystemSettings, SettingsResponse, UpdateCheckResponse, BotConfig } from 'types/settings';
import type { ApiResponse } from 'types/api';

/**
 * 获取系统设置
 */
export async function getSettings(): Promise<ApiResponse<SettingsResponse>> {
  const response = await apiClient.get<ApiResponse<SettingsResponse>>('/api/settings');
  return response.data;
}

/**
 * 更新系统设置
 */
export async function updateSettings(settings: SystemSettings): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/settings', { settings });
  return response.data;
}

/**
 * 重启服务
 */
export async function restartService(): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/settings/restart');
  return response.data;
}

/**
 * 检查更新
 */
export async function checkUpdate(): Promise<ApiResponse<UpdateCheckResponse>> {
  const response = await apiClient.get<ApiResponse<UpdateCheckResponse>>('/api/settings/update');
  return response.data;
}
