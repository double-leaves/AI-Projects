/**
 * 消息角色类型
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * 消息接口
 */
export interface Message {
  /** 消息角色 */
  role: MessageRole;
  /** 消息内容 */
  content: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * API 请求消息格式（用于发送给智谱 AI）
 */
export interface APIMessage {
  role: MessageRole;
  content: string;
}
