/**
 * 系统相关 API
 */

import apiClient from './client';
import type { SystemInfo, BotVersion } from 'types/system';
import type { ApiResponse } from 'types/api';

/**
 * 获取系统信息
 */
export async function getSystemInfo(useCache: boolean = true): Promise<ApiResponse<SystemInfo>> {
  const response = await apiClient.get<ApiResponse<SystemInfo>>('/api/system/info', {
    params: { use_cache: useCache },
  });
  return response.data;
}

/**
 * 获取 WebUI 版本
 */
export async function getWebUIVersion(): Promise<ApiResponse<string>> {
  const response = await apiClient.get<ApiResponse<string>>('/api/system/webui/version');
  return response.data;
}

/**
 * 更新 WebUI
 */
export async function updateWebUI(
  version?: string,
  githubProxy?: string
): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/system/webui/update', {
    version,
    github_proxy: githubProxy,
  });
  return response.data;
}

/**
 * 获取 CORS 配置
 */
export async function getCorsConfig(): Promise<ApiResponse<unknown>> {
  const response = await apiClient.get<ApiResponse<unknown>>('/api/system/cors/config');
  return response.data;
}

/**
 * 更新 CORS 配置
 */
export async function updateCorsConfig(config: {
  allow_origin: string;
  allow_headers: string[];
  allow_methods: string[];
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/system/cors/update', config);
  return response.data;
}
