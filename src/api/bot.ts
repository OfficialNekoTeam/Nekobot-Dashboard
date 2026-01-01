/**
 * Bot 配置相关 API
 */

import apiClient from './client';
import type { BotConfig } from 'types/settings';
import type { ApiResponse } from 'types/api';

/**
 * 获取 Bot 配置
 */
export async function getBotConfig(): Promise<ApiResponse<BotConfig>> {
  const response = await apiClient.get<ApiResponse<BotConfig>>('/api/bot/config');
  return response.data;
}

/**
 * 更新 Bot 配置
 */
export async function updateBotConfig(config: Partial<BotConfig>): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/bot/config', { config });
  return response.data;
}

/**
 * 获取版本信息
 */
export async function getBotVersion(): Promise<ApiResponse<{
  version: string;
  build_time: string;
  git_commit: string;
  git_branch: string;
}>> {
  const response = await apiClient.get<ApiResponse<{
    version: string;
    build_time: string;
    git_commit: string;
    git_branch: string;
  }>>('/api/bot/version');
  return response.data;
}
