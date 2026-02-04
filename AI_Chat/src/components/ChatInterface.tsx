import { useState, useEffect } from 'react';
import { Message, APIMessage } from '../types';
import { streamChat, isAPIKeyConfigured, APIError } from '../api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

/**
 * 聊天界面主组件
 * 整合消息列表、输入框、API 调用、本地存储
 */
export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // 从 LocalStorage 加载历史消息
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('加载历史消息失败:', error);
      }
    }
  }, []);

  // 保存消息到 LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // 检查 API Key 是否配置
  if (!isAPIKeyConfigured()) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-yellow-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">未配置 API Key</h2>
            <p className="text-gray-600 mb-4">
              请在项目根目录创建 <code className="bg-gray-100 px-2 py-1 rounded">.env</code> 文件，
              并添加你的智谱 AI API Key：
            </p>
            <div className="bg-gray-50 rounded p-3 text-left">
              <code className="text-sm text-gray-700">
                VITE_ZHIPU_API_KEY=your_api_key_here
              </code>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              获取 API Key：
              <a
                href="https://open.bigmodel.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-1"
              >
                智谱 AI 开放平台
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 发送消息
  const handleSend = async (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent('');

    // 准备发送给 API 的消息历史
    const apiMessages: APIMessage[] = [
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content,
      },
    ];

    // 调用流式 API
    let fullContent = '';

    await streamChat(
      apiMessages,
      (chunk) => {
        // 接收流式数据
        fullContent += chunk;
        setStreamingContent(fullContent);
      },
      () => {
        // 完成回调
        const assistantMessage: Message = {
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent('');
        setIsLoading(false);
      },
      (error) => {
        // 错误处理
        console.error('API 调用失败:', error);
        
        let errorMsg = '抱歉，发生了错误';
        
        if (error.message.includes('API Key')) {
          errorMsg = '⚠️ API Key 配置错误，请检查 .env 文件中的 VITE_ZHIPU_API_KEY';
        } else if (error.message.includes('网络')) {
          errorMsg = '🌐 网络连接失败，请检查您的网络连接';
        } else if (error instanceof APIError && error.statusCode === 401) {
          errorMsg = '🔑 API Key 无效或已过期，请检查您的密钥';
        } else if (error instanceof APIError && error.statusCode === 429) {
          errorMsg = '⏱️ 请求过于频繁，请稍后再试';
        } else if (error instanceof APIError && error.statusCode === 500) {
          errorMsg = '🔧 服务器内部错误，请稍后重试';
        } else {
          errorMsg = `❌ ${error.message}`;
        }
        
        const errorMessage: Message = {
          role: 'assistant',
          content: errorMsg,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setStreamingContent('');
        setIsLoading(false);
      }
    );
  };

  // 清空对话
  const handleClear = () => {
    if (window.confirm('确定要清空所有对话吗？')) {
      setMessages([]);
      localStorage.removeItem('chat_messages');
    }
  };

  // 当前显示的消息列表（包括正在生成的消息）
  const displayMessages = streamingContent
    ? [
        ...messages,
        {
          role: 'assistant' as const,
          content: streamingContent,
          timestamp: Date.now(),
        },
      ]
    : messages;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">AI 聊天助手</h1>
        <button
          onClick={handleClear}
          disabled={messages.length === 0}
          className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          清空对话
        </button>
      </div>

      {/* 消息列表 */}
      <MessageList messages={displayMessages} />

      {/* 输入框 */}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
