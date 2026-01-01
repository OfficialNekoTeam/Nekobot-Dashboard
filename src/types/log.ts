/**
 * 日志相关类型
 */

/** 日志文件信息 */
export interface LogFile {
  name: string;
  size: number;
  modified: string;
}

/** 日志文件列表响应 */
export interface LogFilesResponse {
  files: LogFile[];
}

/** 日志内容响应 */
export interface LogContentResponse {
  file: string;
  content: string;
  lines: number;
}

/** 日志类型 */
export type LogType = 'all' | 'error' | 'info' | 'debug';
