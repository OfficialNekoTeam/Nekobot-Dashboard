/**
 * MCP (Model Context Protocol) 相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

/**
 * 获取 MCP 服务器列表
 */
export async function getMcpServers(): Promise<ApiResponse<unknown[]>> {
  const response = await apiClient.get<ApiResponse<unknown[]>>('/api/mcp/servers');
  return response.data;
}

/**
 * 添加 MCP 服务器
 */
export async function addMcpServer(config: {
  name: string;
  type: string;
  config: Record<string, unknown>;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/mcp/servers', config);
  return response.data;
}

/**
 * 删除 MCP 服务器
 */
export async function deleteMcpServer(name: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/api/mcp/servers/${name}`);
  return response.data;
}
