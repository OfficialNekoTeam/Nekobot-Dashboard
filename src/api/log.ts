/**
 * 日志相关 API
 */

import apiClient from './client';
import type { LogFile, LogContentResponse, LogType } from 'types/log';
import type { ApiResponse } from 'types/api';

/**
 * 获取日志文件列表
 */
export async function getLogFiles(type: LogType = 'all'): Promise<ApiResponse<{ files: LogFile[] }>> {
  const response = await apiClient.get<ApiResponse<{ files: LogFile[] }>>('/api/logs/list', {
    params: { type },
  });
  return response.data;
}

/**
 * 获取日志内容
 */
export async function getLogContent(
  file: string,
  lines: number = 100
): Promise<ApiResponse<LogContentResponse>> {
  const response = await apiClient.get<ApiResponse<LogContentResponse>>('/api/logs/content', {
    params: { file, lines: Math.min(lines, 1000) },
  });
  return response.data;
}
