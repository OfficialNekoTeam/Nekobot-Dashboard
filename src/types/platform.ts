/**
 * 平台相关类型
 */

/** 平台适配器 */
export interface Platform {
  type: string;
  id: string;
  name: string;
  enabled: boolean;
  connected: string;
}

/** 平台统计 */
export interface PlatformStats {
  [platformType: string]: {
    total: number;
    enabled: number;
    messages: number;
  };
}

/** 添加平台请求 */
export interface AddPlatformRequest {
  type: string;
  id: string;
  name: string;
}

/** 更新平台请求 */
export interface UpdatePlatformRequest {
  type: string;
  id: string;
  updates: {
    enable?: boolean;
    id?: string;
    name?: string;
  };
}
