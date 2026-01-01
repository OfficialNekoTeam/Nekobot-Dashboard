/**
 * 知识库相关类型
 */

/** 知识库 */
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  embedding_model: string;
  document_count: number;
  created_at?: string;
}

/** 创建知识库请求 */
export interface CreateKnowledgeBaseRequest {
  id: string;
  name: string;
  description: string;
  embedding_model?: string;
}

/** 更新知识库请求 */
export interface UpdateKnowledgeBaseRequest {
  name?: string;
  description?: string;
  embedding_model?: string;
}

/** 知识库文档 */
export interface KnowledgeBaseDocument {
  doc_id: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

/** 添加文档请求 */
export interface AddDocumentRequest {
  content: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

/** 搜索请求 */
export interface SearchRequest {
  query: string;
  top_k?: number;
}

/** 知识库统计 */
export interface KnowledgeBaseStats {
  total_documents: number;
  total_chunks: number;
  embedding_model: string;
}
