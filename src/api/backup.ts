/**
 * 备份管理相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

/**
 * 备份信息类型
 */
export interface Backup {
  id: string;
  filename: string;
  size: number;
  size_formatted: string;
  description?: string;
  created_at: string;
  md5?: string;
}

/**
 * 创建备份响应
 */
export interface CreateBackupResponse {
  backup_id: string;
  filename: string;
}

/**
 * 获取备份列表
 */
export async function getBackups(): Promise<ApiResponse<{ backups: Backup[] }>> {
  const response = await apiClient.get<ApiResponse<{ backups: Backup[] }>>('/api/backup/list');
  return response.data;
}

/**
 * 创建备份
 */
export async function createBackup(
  description?: string
): Promise<ApiResponse<CreateBackupResponse>> {
  const response = await apiClient.post<ApiResponse<CreateBackupResponse>>('/api/backup/create', {
    description,
  });
  return response.data;
}

/**
 * 下载备份
 */
export async function downloadBackup(backupId: string): Promise<Blob> {
  const response = await apiClient.get('/api/backup/download', {
    params: { id: backupId },
    responseType: 'blob',
  });
  return response.data;
}

/**
 * 恢复备份
 */
export async function restoreBackup(backupId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/backup/restore', {
    id: backupId,
  });
  return response.data;
}

/**
 * 删除备份
 */
export async function deleteBackup(backupId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/backup/delete', {
    id: backupId,
  });
  return response.data;
}

/**
 * 上传备份
 */
export async function uploadBackup(file: File, description?: string): Promise<ApiResponse<Backup>> {
  const formData = new FormData();
  formData.append('file', file);
  if (description) {
    formData.append('description', description);
  }

  const response = await apiClient.post<ApiResponse<Backup>>('/api/backup/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * 获取备份配置
 */
export async function getBackupConfig(): Promise<ApiResponse<any>> {
  const response = await apiClient.get<ApiResponse<any>>('/api/backup/config');
  return response.data;
}

/**
 * 更新备份配置
 */
export async function updateBackupConfig(config: any): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/backup/config', config);
  return response.data;
}
