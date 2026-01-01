/**
 * 路由守卫组件
 * 保护需要认证的路由
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 双重检查：状态和 localStorage
  const hasToken = !!localStorage.getItem('access_token');
  const isAuth = isAuthenticated || hasToken;

  // 检查是否是登录页面
  const isLoginPage = location.pathname === '/login';

  // 如果已登录且访问登录页面，重定向到首页
  if (!isLoading && isAuth && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    // 可以显示加载指示器
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>加载中...</div>
      </div>
    );
  }

  if (!isAuth) {
    // 保存当前路径，登录后返回
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
