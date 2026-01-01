/**
 * 认证上下文
 * 提供全局的认证状态管理
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout } from 'api';
import type { LoginRequest, UserInfo } from 'types/auth';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查用户是否已登录
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setUser({ username, token });
    }
    setIsLoading(false);
  }, []);

  // 登录
  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await apiLogin(credentials);

    if (response.success && response.data) {
      const { access_token, username } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('username', username);
      setUser({ username, token: access_token });
    } else {
      throw new Error(response.message || '登录失败');
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      // 忽略登出 API 错误，继续清除本地状态
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      setUser(null);
    }
  }, []);

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
