/**
 * 命令相关类型
 */

/** 命令信息 */
export interface Command {
  handler_full_name: string;
  handler_name: string;
  plugin: string;
  description: string;
  effective_command: string;
  aliases: string[];
  permission: string;
  enabled: boolean;
  has_conflict: boolean;
}

/** 命令列表响应 */
export interface CommandsResponse {
  items: Command[];
  summary: {
    total: number;
    disabled: number;
    conflicts: number;
  };
}

/** 命令冲突 */
export interface CommandConflict {
  command1: string;
  command2: string;
  conflict_type: string;
}

/** 切换命令状态请求 */
export interface ToggleCommandRequest {
  handler_full_name: string;
  enabled: boolean;
}

/** 重命名命令请求 */
export interface RenameCommandRequest {
  handler_full_name: string;
  new_name: string;
  aliases?: string[];
}
