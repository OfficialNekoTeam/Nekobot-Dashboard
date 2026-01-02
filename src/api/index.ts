/**
 * API 服务层统一入口
 *
 * 提供所有后端 API 的封装
 */

export * from './auth';
export * from './agent';
export * from './backup';
export * from './bot';
export * from './chat';
export * from './command';
export * from './hot-reload';
export * from './knowledge-base';
export * from './llm';
export * from './log';
export * from './long-term-memory';
export * from './mcp';
export * from './personality';
export * from './pipeline';
export * from './platform';
export * from './plugin';
export * from './settings';
export * from './stat';
export * from './system';
export * from './system-prompt';
export * from './tool';
export * from './tool-prompt';

// Conversation exports - renamed to avoid conflicts with chat exports
export {
  getConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
  getConversationMessages,
  addConversationMessage,
  getConversationContext,
  getConversationTemplates,
  createConversationTemplate,
  getConversationStats,
  searchConversations,
  switchConversation,
  // Session-related functions from conversation API (renamed to avoid conflicts)
  getSessions as getConversationSessions,
  getSession as getConversationSession,
  deleteSession as deleteConversationSession,
  type Conversation,
  type ConversationMessage,
  type Session,
  type ConversationTemplate,
  type ConversationStats,
} from './conversation';

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