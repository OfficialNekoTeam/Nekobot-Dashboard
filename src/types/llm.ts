/**
 * LLM 服务商相关类型
 */

/** LLM 服务商 */
export interface LLMProvider {
  id: string;
  name: string;
  type: string;
  base_url: string;
  model: string;
  enabled: boolean;
  created_at: string;
}

/** 服务商类型 */
export interface ProviderType {
  type: string;
  display_name: string;
  description: string;
}

/** 添加服务商请求 */
export interface AddProviderRequest {
  name: string;
  type: string;
  api_key: string;
  base_url?: string;
  model?: string;
  enabled?: boolean;
}

/** 更新服务商请求 */
export interface UpdateProviderRequest {
  id: string;
  name?: string;
  type?: string;
  api_key?: string;
  base_url?: string;
  model?: string;
  enabled?: boolean;
}
