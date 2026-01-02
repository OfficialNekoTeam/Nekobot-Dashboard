/**
 * Pipeline 管理相关 API
 */

import apiClient from './client';
import type { ApiResponse } from 'types/api';

// ==============================|| TYPES ||============================== //

export interface Pipeline {
  id: string;
  name: string;
  priority: 'low' | 'normal' | 'high';
  enabled: boolean;
  stages_count: number;
}

export interface PipelineInfo extends Pipeline {
  stages: Array<{
    name: string;
    priority: string;
    enabled: boolean;
  }>;
}

export interface PipelineStatus {
  id: string;
  name: string;
  enabled: boolean;
  running: boolean;
  last_execution: string | null;
  execution_count: number;
}

export interface PipelineStage {
  index: number;
  name: string;
  priority: string;
  enabled: boolean;
}

export interface PipelineConfig {
  id: string;
  name: string;
  priority: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface PipelineTask {
  id: string;
  pipeline_id: string;
  status: string;
  created_at: string;
}

// ==============================|| API RESPONSES ||============================== //

export interface PipelinesListResponse {
  pipelines: Pipeline[];
  total: number;
  page: number;
  page_size: number;
}

// ==============================|| API FUNCTIONS ||============================== //

/**
 * 获取所有 Pipeline
 */
export async function getPipelines(params?: {
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<ApiResponse<PipelinesListResponse>> {
  const response = await apiClient.get<ApiResponse<PipelinesListResponse>>('/api/pipeline/list', { params });
  return response.data;
}

/**
 * 获取 Pipeline 详情
 */
export async function getPipelineInfo(pipelineId: string): Promise<ApiResponse<PipelineInfo>> {
  const response = await apiClient.get<ApiResponse<PipelineInfo>>('/api/pipeline/info', {
    params: { pipeline_id: pipelineId },
  });
  return response.data;
}

/**
 * 创建 Pipeline
 */
export async function createPipeline(data: {
  name: string;
  priority?: 'low' | 'normal' | 'high';
  stages?: Array<any>;
}): Promise<ApiResponse<{ pipeline_id: string }>> {
  const response = await apiClient.post<ApiResponse<{ pipeline_id: string }>>('/api/pipeline/create', data);
  return response.data;
}

/**
 * 删除 Pipeline
 */
export async function deletePipeline(pipelineId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/pipeline/delete', {
    pipeline_id: pipelineId,
  });
  return response.data;
}

/**
 * 执行 Pipeline
 */
export async function executePipeline(data: {
  pipeline_id: string;
  context?: {
    event?: any;
    metadata?: Record<string, any>;
  };
}): Promise<ApiResponse<{ pipeline_id: string; status: string }>> {
  const response = await apiClient.post<ApiResponse<{ pipeline_id: string; status: string }>>(
    '/api/pipeline/execute',
    data
  );
  return response.data;
}

/**
 * 获取 Pipeline 状态
 */
export async function getPipelineStatus(pipelineId: string): Promise<ApiResponse<PipelineStatus>> {
  const response = await apiClient.get<ApiResponse<PipelineStatus>>('/api/pipeline/status', {
    params: { pipeline_id: pipelineId },
  });
  return response.data;
}

/**
 * 获取 Pipeline 阶段列表
 */
export async function getPipelineStages(pipelineId: string): Promise<ApiResponse<{ stages: PipelineStage[] }>> {
  const response = await apiClient.get<ApiResponse<{ stages: PipelineStage[] }>>('/api/pipeline/stages/list', {
    params: { pipeline_id: pipelineId },
  });
  return response.data;
}

/**
 * 添加 Pipeline 阶段
 */
export async function addPipelineStage(data: {
  pipeline_id: string;
  stage_name: string;
  priority?: 'low' | 'normal' | 'high';
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/pipeline/stages/add', data);
  return response.data;
}

/**
 * 移除 Pipeline 阶段
 */
export async function removePipelineStage(data: {
  pipeline_id: string;
  stage_index: number;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/pipeline/stages/remove', data);
  return response.data;
}

/**
 * 获取 Pipeline 配置
 */
export async function getPipelineConfig(pipelineId: string): Promise<ApiResponse<PipelineConfig>> {
  const response = await apiClient.get<ApiResponse<PipelineConfig>>('/api/pipeline/config', {
    params: { pipeline_id: pipelineId },
  });
  return response.data;
}

/**
 * 更新 Pipeline 配置
 */
export async function updatePipelineConfig(data: {
  pipeline_id: string;
  config: {
    enabled?: boolean;
    priority?: 'low' | 'normal' | 'high';
  };
}): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/pipeline/config', data);
  return response.data;
}

/**
 * 获取 Pipeline 任务列表
 */
export async function getPipelineTasks(params?: {
  pipeline_id?: string;
  status?: string;
  limit?: number;
}): Promise<ApiResponse<{ tasks: PipelineTask[]; count: number }>> {
  const response = await apiClient.get<ApiResponse<{ tasks: PipelineTask[]; count: number }>>('/api/pipeline/tasks', { params });
  return response.data;
}

/**
 * 取消 Pipeline 任务
 */
export async function cancelPipelineTask(taskId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/pipeline/tasks/cancel', {
    task_id: taskId,
  });
  return response.data;
}
