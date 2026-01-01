/**
 * 统计相关 API
 */

import apiClient from './client';
import type { DashboardStats, VersionInfo } from 'types/stat';
import type { ApiResponse } from 'types/api';

/**
 * 获取仪表板统计数据
 */
export async function getDashboardStats(
  startDate?: string,
  endDate?: string,
  useCache: boolean = true
): Promise<ApiResponse<DashboardStats>> {
  const response = await apiClient.get<ApiResponse<DashboardStats>>('/api/stat/get', {
    params: {
      start_date: startDate,
      end_date: endDate,
      use_cache: useCache,
    },
  });
  return response.data;
}

/**
 * 获取版本和迁移信息
 */
export async function getVersionInfo(): Promise<ApiResponse<VersionInfo>> {
  const response = await apiClient.get<ApiResponse<VersionInfo>>('/api/stat/version');
  return response.data;
}
