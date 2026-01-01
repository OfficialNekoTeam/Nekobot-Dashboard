/**
 * 设置相关类型
 */

/** 系统设置 */
export interface SystemSettings {
  theme?: string;
  language?: string;
  notifications?: {
    enabled: boolean;
    types: string[];
  };
  auto_restart?: boolean;
  [key: string]: unknown;
}

/** 设置响应 */
export interface SettingsResponse {
  settings: SystemSettings;
  config?: Record<string, unknown>;
}

/** 更新检查响应 */
export interface UpdateCheckResponse {
  current_version: string;
  has_update: boolean;
  latest_version?: string;
  update_url?: string;
}

/** Bot 配置 */
export interface BotConfig {
  command_prefix: string;
  server: Record<string, unknown>;
  jwt: Record<string, unknown>;
  webui_enabled: boolean;
  demo: boolean;
  llm_reply_mode: string;
  platforms: Record<string, unknown>;
}
