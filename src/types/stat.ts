/**
 * 统计相关类型
 */

/** 仪表板统计数据 */
export interface DashboardStats {
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  plugins: {
    total: number;
    enabled: number;
    disabled: number;
  };
  platforms: {
    total: number;
    running: number;
    stopped: number;
  };
  messages: {
    total: number;
    by_platform: Array<{
      platform: string;
      messages: number;  // 后端使用 messages 字段
    }>;
  };
  user_activity?: {
    active_users: number;
    new_users?: number;
    total_sessions?: number;  // 后端可能没有这个字段
  };
  resource_usage: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  generated_at: string;
}

/** 版本和迁移信息 */
export interface VersionInfo {
  version: string;
  webui_version: string;
  build_time: string;
  uptime: string;
  migrations: {
    total: number;
    applied: number;
    pending: number;
    last_migration?: {
      id: string;
      name: string;
      applied_at: string;
    };
    list: Array<{
      id: string;
      name: string;
      applied?: string;
    }>;
  };
  system: {
    python_version: string;
    framework: string;
    database: string;
  };
  last_updated: string;
}
