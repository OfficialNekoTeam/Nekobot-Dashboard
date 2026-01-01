/**
 * 认证相关类型
 */

/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  first_login: boolean;
}

/** 修改密码请求 */
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

/** 用户信息 */
export interface UserInfo {
  username: string;
  token?: string;
}
