/**
 * Agent 管理相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

// ==============================|| TYPES ||============================== //

export interface Agent {
  id: string;
  name: string;
  type: 'llm' | 'composite';
  status?: 'active' | 'inactive';
  config?: AgentConfig;
  created_at?: string;
  updated_at?: string;
}

export interface AgentConfig {
  name?: string;
  llm_provider_id: string;
  model: string;
  temperature: number;
  max_tokens?: number;
  max_iterations?: number;
  enable_stream: boolean;
  enable_tools: boolean;
  system_prompt?: string;
  metadata?: Record<string, any>;
}

export interface AgentsListResponse {
  agents: Agent[];
  total: number;
  page: number;
  page_size: number;
}

export interface AgentInfo {
  id: string;
  name: string;
  config: {
    llm_provider_id: string;
    model: string;
    temperature: number;
    max_tokens?: number;
    max_iterations?: number;
    enable_stream: boolean;
    enable_tools: boolean;
    system_prompt?: string;
  };
  hooks_count: number;
  tools_count: number;
}

export interface AgentHookInfo {
  type: string;
  name: string;
}

export interface AgentMetrics {
  [key: string]: any;
}

export interface OperationLog {
  [key: string]: any;
}

// ==============================|| API FUNCTIONS ||============================== //

/**
 * 获取所有 Agent
 */
export async function getAgents(page = 1, pageSize = 10): Promise<ApiResponse<AgentsListResponse>> {
  const response = await apiClient.get<ApiResponse<AgentsListResponse>>('/api/agent/list', {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

/**
 * 获取 Agent 详情
 */
export async function getAgentInfo(agentId: string): Promise<ApiResponse<AgentInfo>> {
  const response = await apiClient.get<ApiResponse<AgentInfo>>('/api/agent/info', {
    params: { agent_id: agentId },
  });
  return response.data;
}

/**
 * 获取 Agent 配置
 */
export async function getAgentConfig(agentId: string): Promise<ApiResponse<AgentConfig>> {
  const response = await apiClient.get<ApiResponse<AgentConfig>>('/api/agent/config', {
    params: { agent_id: agentId },
  });
  return response.data;
}

/**
 * 更新 Agent 配置
 */
export async function updateAgentConfig(
  agentId: string,
  config: Partial<AgentConfig>
): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/agent/config', {
    agent_id: agentId,
    config,
  });
  return response.data;
}

/**
 * 执行 Agent
 */
export async function executeAgent(data: {
  agent_id: string;
  message: string;
  context?: {
    session_id?: string;
    platform_id?: string;
    user_id?: string;
    channel_id?: string;
  };
  stream?: boolean;
}): Promise<ApiResponse<any>> {
  const response = await apiClient.post<ApiResponse<any>>('/api/agent/execute', data);
  return response.data;
}

/**
 * 获取 Agent Hooks 列表
 */
export async function getAgentHooks(agentId: string): Promise<ApiResponse<{ hooks: AgentHookInfo[] }>> {
  const response = await apiClient.get<ApiResponse<{ hooks: AgentHookInfo[] }>>('/api/agent/hooks/list', {
    params: { agent_id: agentId },
  });
  return response.data;
}

/**
 * 添加 Agent Hook
 */
export async function addAgentHook(
  agentId: string,
  hookType: 'logging' | 'metrics'
): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/agent/hooks/add', {
    agent_id: agentId,
    hook_type: hookType,
  });
  return response.data;
}

/**
 * 移除 Agent Hook
 */
export async function removeAgentHook(
  agentId: string,
  hookIndex: number
): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/agent/hooks/remove', {
    agent_id: agentId,
    hook_index: hookIndex,
  });
  return response.data;
}

/**
 * 获取 Agent 指标
 */
export async function getAgentMetrics(agentId: string): Promise<ApiResponse<AgentMetrics>> {
  const response = await apiClient.get<ApiResponse<AgentMetrics>>('/api/agent/metrics', {
    params: { agent_id: agentId },
  });
  return response.data;
}

/**
 * 获取 Agent 日志
 */
export async function getAgentLogs(agentId: string, limit = 50): Promise<ApiResponse<{ logs: OperationLog[]; count: number }>> {
  const response = await apiClient.get<ApiResponse<{ logs: OperationLog[]; count: number }>>('/api/agent/logs', {
    params: { agent_id: agentId, limit },
  });
  return response.data;
}
