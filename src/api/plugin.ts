/**
 * 插件管理相关 API
 */

import apiClient from './client';
import type {
  Plugin,
  PluginsListResponse,
  PluginConfig,
  PluginConfigResponse,
  UploadPluginResponse,
} from 'types/plugin';
import type { ApiResponse } from 'types/api';

/**
 * 获取所有插件
 */
export async function getPlugins(): Promise<ApiResponse<PluginsListResponse>> {
  const response = await apiClient.get<ApiResponse<PluginsListResponse>>('/api/plugins/list');
  return response.data;
}

/**
 * 获取插件详情
 */
export async function getPluginInfo(name: string): Promise<ApiResponse<Plugin>> {
  const response = await apiClient.get<ApiResponse<Plugin>>('/api/plugins/info', {
    params: { name },
  });
  return response.data;
}

/**
 * 启用插件
 */
export async function enablePlugin(name: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/plugins/enable', { name });
  return response.data;
}

/**
 * 禁用插件
 */
export async function disablePlugin(name: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/plugins/disable', { name });
  return response.data;
}

/**
 * 重载插件
 */
export async function reloadPlugin(name: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/plugins/reload', { name });
  return response.data;
}

/**
 * 上传插件
 */
export async function uploadPlugin(file: File): Promise<ApiResponse<UploadPluginResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<UploadPluginResponse>>(
    '/api/plugins/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * 删除插件
 */
export async function deletePlugin(name: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/plugins/delete', { name });
  return response.data;
}

/**
 * 获取插件配置
 */
export async function getPluginConfig(name: string): Promise<ApiResponse<PluginConfigResponse>> {
  const response = await apiClient.get<ApiResponse<PluginConfigResponse>>('/api/plugins/config', {
    params: { name },
  });
  return response.data;
}

/**
 * 更新插件配置
 */
export async function updatePluginConfig(
  name: string,
  config: PluginConfig
): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/plugins/config', {
    name,
    config,
  });
  return response.data;
}

/**
 * 从 URL 安装插件
 */
export async function installPlugin(url: string, proxy?: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/plugins/install', {
    url,
    proxy,
  });
  return response.data;
}
