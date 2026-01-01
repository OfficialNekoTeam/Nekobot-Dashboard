/**
 * 命令管理相关 API
 */

import apiClient from './client';
import type {
  CommandsResponse,
  CommandConflict,
  ToggleCommandRequest,
  RenameCommandRequest,
} from 'types/command';
import type { ApiResponse } from 'types/api';

/**
 * 获取所有命令
 */
export async function getCommands(): Promise<ApiResponse<CommandsResponse>> {
  const response = await apiClient.get<ApiResponse<CommandsResponse>>('/commands');
  return response.data;
}

/**
 * 获取命令冲突
 */
export async function getCommandConflicts(): Promise<ApiResponse<CommandConflict[]>> {
  const response = await apiClient.get<ApiResponse<CommandConflict[]>>('/commands/conflicts');
  return response.data;
}

/**
 * 切换命令状态
 */
export async function toggleCommand(data: ToggleCommandRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/commands/toggle', data);
  return response.data;
}

/**
 * 重命名命令
 */
export async function renameCommand(data: RenameCommandRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/commands/rename', data);
  return response.data;
}
