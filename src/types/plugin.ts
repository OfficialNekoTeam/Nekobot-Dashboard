/**
 * 插件相关类型
 */

/** 插件信息 */
export interface Plugin {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  commands: string[];
  is_official: boolean;
}

/** 插件配置 */
export interface PluginConfig {
  [key: string]: unknown;
}

/** 插件配置响应 */
export interface PluginConfigResponse {
  config: PluginConfig;
  schema?: Record<string, unknown>;
}

/** 上传插件响应 */
export interface UploadPluginResponse {
  plugin_name: string;
}

/** 插件列表响应 */
export interface PluginsListResponse {
  [pluginName: string]: Plugin;
}
