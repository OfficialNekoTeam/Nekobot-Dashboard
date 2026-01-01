/**
 * API 服务层统一入口
 *
 * 提供所有后端 API 的封装
 */

export * from './auth';
export * from './bot';
export * from './chat';
export * from './command';
export * from './plugin';
export * from './llm';
export * from './platform';
export * from './knowledge-base';
export * from './mcp';
export * from './log';
export * from './stat';
export * from './system';
export * from './settings';
export * from './personality';
export * from './system-prompt';
export * from './tool-prompt';
export * from './hot-reload';

// Session exports - renamed to avoid conflicts with chat exports
export {
  getUserSessions,
  createSession,
  getSession as getUserSessionDetail,
  deleteSession as deleteUserSession,
  updateSessionSummary,
  getSessionContext,
  getSessionStats,
  clearSessionContext,
} from './session';