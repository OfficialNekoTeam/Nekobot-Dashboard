/**
 * Axios 客户端配置
 * 提供 API 请求的基础配置和拦截器
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from 'types/api';

// 从环境变量获取 API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6285';

/**
 * 创建 Axios 实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器 - 自动添加 JWT token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 统一处理错误和格式转换
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 转换后端响应格式：status -> success
    const originalData = response.data as any;
    if (originalData && typeof originalData === 'object') {
      // 如果后端返回的是 status 字段，转换为 success
      if ('status' in originalData && !('success' in originalData)) {
        response.data = {
          ...originalData,
          success: originalData.status === 'success',
        } as ApiResponse;
      }
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      // 清除本地存储的 token
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      // 可以在这里触发重定向到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 返回统一的错误格式
    const errorMessage = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject({
      message: errorMessage,
      code: error.response?.status,
      originalError: error,
    });
  }
);

export default apiClient;
