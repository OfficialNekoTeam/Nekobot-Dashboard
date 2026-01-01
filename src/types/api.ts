/**
 * API 通用响应类型
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * 错误响应类型
 */
export interface ApiError {
  success: false;
  message: string;
  code?: string;
}
