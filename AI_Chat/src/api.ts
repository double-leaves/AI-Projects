import { APIMessage } from './types';

/**
 * 智谱 AI API 配置
 */
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_API_KEY = import.meta.env.VITE_ZHIPU_API_KEY;

/**
 * API 错误类
 */
export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * 流式响应回调函数类型
 */
export type StreamCallback = (chunk: string) => void;

/**
 * 调用智谱 AI Chat Completions API（流式输出）
 * 
 * @param messages - 消息历史记录
 * @param onStream - 流式数据回调函数
 * @param onComplete - 完成回调函数
 * @param onError - 错误回调函数
 */
export async function streamChat(
  messages: APIMessage[],
  onStream: StreamCallback,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  // 检查 API Key
  if (!ZHIPU_API_KEY) {
    onError(new APIError('未配置 API Key，请在 .env 文件中设置 VITE_ZHIPU_API_KEY'));
    return;
  }

  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',  // 使用 glm-4-flash 模型
        messages: messages,
        stream: true,  // 启用流式输出
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error?.message || `API 请求失败: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      throw new APIError('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      // 解码数据块
      buffer += decoder.decode(value, { stream: true });
      
      // 按行分割处理 SSE 数据
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一行不完整的数据

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // 跳过空行和注释
        if (!trimmedLine || trimmedLine.startsWith(':')) {
          continue;
        }

        // 处理 SSE 数据行
        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6); // 移除 "data: " 前缀
          
          // 检查是否是结束标记
          if (data === '[DONE]') {
            continue;
          }

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            
            if (content) {
              onStream(content);
            }
          } catch (e) {
            console.warn('解析 SSE 数据失败:', data, e);
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof APIError) {
      onError(error);
    } else if (error instanceof Error) {
      onError(new APIError(error.message));
    } else {
      onError(new APIError('未知错误'));
    }
  }
}

/**
 * 获取 API Key 配置状态
 */
export function isAPIKeyConfigured(): boolean {
  return !!ZHIPU_API_KEY;
}
