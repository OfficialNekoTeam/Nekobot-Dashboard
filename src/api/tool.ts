/**
 * 工具系统 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

// ==============================|| TYPES ||============================== //

export type ToolCategory =
  | 'llm'
  | 'knowledge'
  | 'web_search'
  | 'web_scraper'
  | 'file'
  | 'database'
  | 'notification'
  | 'utility'
  | 'custom';

export interface Tool {
  name: string;
  description: string;
  category: ToolCategory;
  active: boolean;
  parameters: Record<string, any>;
  has_handler: boolean;
  metadata?: Record<string, any>;
}

export interface ToolInfo extends Tool {
  metadata?: Record<string, any>;
}

export interface ToolMetrics {
  name: string;
  category: ToolCategory;
  executions: number;
  errors: number;
  avg_execution_time: number;
  success_rate: number;
}

export interface ToolStats {
  total: number;
  active: number;
  inactive: number;
  with_handler: number;
  by_category: Record<string, number>;
}

export interface ToolPermissions {
  tool_name?: string;
  allowed_users: string[];
  allowed_roles: string[];
  denied_users: string[];
}

export interface ToolTestResult {
  tool_name: string;
  validation_passed: boolean;
  validation_error?: string;
  parameters_valid: boolean;
  can_execute: boolean;
}

// ==============================|| API RESPONSES ||============================== //

export interface ToolsListResponse {
  tools: Tool[];
  total: number;
  page: number;
  page_size: number;
}

export interface ToolStatsResponse {
  total: number;
  active: number;
  inactive: number;
  with_handler: number;
  by_category: Record<string, number>;
}

export interface ToolCategoriesResponse {
  categories: Array<{
    value: string;
    name: string;
  }>;
}

export interface ToolExecuteResponse {
  result: any;
  execution_time: number;
}

// ==============================|| API FUNCTIONS ||============================== //

/**
 * 获取工具列表
 */
export async function getTools(params?: {
  category?: ToolCategory;
  active_only?: boolean;
  page?: number;
  page_size?: number;
}): Promise<ApiResponse<ToolsListResponse>> {
  const response = await apiClient.get<ApiResponse<ToolsListResponse>>('/api/tools/list', { params });
  return response.data;
}

/**
 * 获取工具详情
 */
export async function getToolInfo(toolName: string): Promise<ApiResponse<ToolInfo>> {
  const response = await apiClient.get<ApiResponse<ToolInfo>>('/api/tools/info', {
    params: { tool_name: toolName },
  });
  return response.data;
}

/**
 * 注册新工具
 */
export async function registerTool(data: {
  name: string;
  description?: string;
  category?: ToolCategory;
  parameters?: Record<string, any>;
  handler_module_path?: string;
}): Promise<ApiResponse<{ tool_name: string }>> {
  const response = await apiClient.post<ApiResponse<{ tool_name: string }>>('/api/tools/register', data);
  return response.data;
}

/**
 * 注销工具
 */
export async function unregisterTool(toolName: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/tools/unregister', {
    tool_name: toolName,
  });
  return response.data;
}

/**
 * 执行工具
 */
export async function executeTool(data: {
  tool_name: string;
  arguments: Record<string, any>;
  context?: {
    session_id?: string;
    platform_id?: string;
    user_id?: string;
  };
}): Promise<ApiResponse<ToolExecuteResponse>> {
  const response = await apiClient.post<ApiResponse<ToolExecuteResponse>>('/api/tools/execute', data);
  return response.data;
}

/**
 * 获取工具指标
 */
export async function getToolMetrics(params?: {
  tool_name?: string;
  time_range?: number;
}): Promise<ApiResponse<{ metrics: ToolMetrics[] }>> {
  const response = await apiClient.get<ApiResponse<{ metrics: ToolMetrics[] }>>('/api/tools/metrics', { params });
  return response.data;
}

/**
 * 获取工具统计
 */
export async function getToolStats(): Promise<ApiResponse<ToolStatsResponse>> {
  const response = await apiClient.get<ApiResponse<ToolStatsResponse>>('/api/tools/stats');
  return response.data;
}

/**
 * 获取工具类别
 */
export async function getToolCategories(): Promise<ApiResponse<ToolCategoriesResponse>> {
  const response = await apiClient.get<ApiResponse<ToolCategoriesResponse>>('/api/tools/categories');
  return response.data;
}

/**
 * 获取工具权限
 */
export async function getToolPermissions(toolName?: string): Promise<ApiResponse<Record<string, ToolPermissions>>> {
  const response = await apiClient.get<ApiResponse<Record<string, ToolPermissions>>>('/api/tools/permissions', {
    params: toolName ? { tool_name: toolName } : {},
  });
  return response.data;
}

/**
 * 更新工具权限
 */
export async function updateToolPermissions(data: {
  tool_name: string;
  allowed_users?: string[];
  allowed_roles?: string[];
  denied_users?: string[];
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/tools/permissions', data);
  return response.data;
}

/**
 * 测试工具
 */
export async function testTool(data: {
  tool_name: string;
  arguments?: Record<string, any>;
}): Promise<ApiResponse<ToolTestResult>> {
  const response = await apiClient.post<ApiResponse<ToolTestResult>>('/api/tools/test', data);
  return response.data;
}
