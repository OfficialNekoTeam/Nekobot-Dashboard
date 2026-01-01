/**
 * 认证相关 API
 */

import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
} from 'types/auth';
import type { ApiResponse } from 'types/api';

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
  return response.data;
}

/**
 * 用户登出
 */
export async function logout(): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/auth/logout');
  return response.data;
}

/**
 * 修改密码
 */
export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/api/auth/change-password', data);
  return response.data;
}
