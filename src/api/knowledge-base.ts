/**
 * 知识库相关 API
 */

import apiClient from './client';
import type {
  KnowledgeBase,
  CreateKnowledgeBaseRequest,
  UpdateKnowledgeBaseRequest,
  KnowledgeBaseDocument,
  AddDocumentRequest,
  SearchRequest,
  KnowledgeBaseStats,
} from 'types/knowledge-base';
import type { ApiResponse } from 'types/api';

/**
 * 获取所有知识库
 */
export async function getKnowledgeBases(): Promise<ApiResponse<KnowledgeBase[]>> {
  const response = await apiClient.get<ApiResponse<KnowledgeBase[]>>('/api/knowledge-bases');
  return response.data;
}

/**
 * 创建知识库
 */
export async function createKnowledgeBase(
  data: CreateKnowledgeBaseRequest
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>(
    '/api/knowledge-bases',
    data
  );
  return response.data;
}

/**
 * 获取知识库详情
 */
export async function getKnowledgeBase(kbId: string): Promise<ApiResponse<KnowledgeBase>> {
  const response = await apiClient.get<ApiResponse<KnowledgeBase>>(
    `/api/knowledge-bases/${kbId}`
  );
  return response.data;
}

/**
 * 更新知识库
 */
export async function updateKnowledgeBase(
  kbId: string,
  data: UpdateKnowledgeBaseRequest
): Promise<ApiResponse<void>> {
  const response = await apiClient.put<ApiResponse<void>>(
    `/api/knowledge-bases/${kbId}`,
    data
  );
  return response.data;
}

/**
 * 删除知识库
 */
export async function deleteKnowledgeBase(kbId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/api/knowledge-bases/${kbId}`
  );
  return response.data;
}

/**
 * 添加文档
 */
export async function addDocument(
  kbId: string,
  data: AddDocumentRequest
): Promise<ApiResponse<{ doc_id: string }>> {
  const response = await apiClient.post<ApiResponse<{ doc_id: string }>>(
    `/api/knowledge-bases/${kbId}/documents`,
    data
  );
  return response.data;
}

/**
 * 删除文档
 */
export async function deleteDocument(kbId: string, docId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/api/knowledge-bases/${kbId}/documents/${docId}`
  );
  return response.data;
}

/**
 * 获取文档详情
 */
export async function getDocument(
  kbId: string,
  docId: string
): Promise<ApiResponse<KnowledgeBaseDocument>> {
  const response = await apiClient.get<ApiResponse<KnowledgeBaseDocument>>(
    `/api/knowledge-bases/${kbId}/documents/${docId}`
  );
  return response.data;
}

/**
 * 搜索文档
 */
export async function searchDocuments(
  kbId: string,
  data: SearchRequest
): Promise<ApiResponse<KnowledgeBaseDocument[]>> {
  const response = await apiClient.post<ApiResponse<KnowledgeBaseDocument[]>>(
    `/api/knowledge-bases/${kbId}/search`,
    data
  );
  return response.data;
}

/**
 * 获取知识库统计
 */
export async function getKnowledgeBaseStats(
  kbId: string
): Promise<ApiResponse<KnowledgeBaseStats>> {
  const response = await apiClient.get<ApiResponse<KnowledgeBaseStats>>(
    `/api/knowledge-bases/${kbId}/stats`
  );
  return response.data;
}

/**
 * 导出知识库
 */
export async function exportKnowledgeBase(kbId: string): Promise<Blob> {
  const response = await apiClient.get(`/api/knowledge-bases/${kbId}/export`, {
    responseType: 'blob',
  });
  return response.data;
}
