import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

/**
 * 单条消息组件
 * 支持 Markdown 渲染和代码高亮
 */
export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  // 复制消息内容
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 relative group ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {/* 复制按钮 - 仅在 AI 消息上显示 */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 hover:bg-gray-200 rounded p-1.5 text-gray-600"
            title="复制消息"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
        {isUser ? (
          // 用户消息直接显示文本
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          // AI 消息使用 Markdown 渲染
          <ReactMarkdown
            components={{
              // 自定义代码块渲染
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !className;
                const codeString = String(children).replace(/\n$/, '');
                
                return !isInline && match ? (
                  <div className="relative group/code">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(codeString);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        } catch (error) {
                          console.error('复制代码失败:', error);
                        }
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 rounded px-2 py-1 text-xs text-white"
                      title="复制代码"
                    >
                      {copied ? '已复制!' : '复制'}
                    </button>
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // 自定义段落样式
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              // 自定义列表样式
              ul({ children }) {
                return <ul className="list-disc list-inside mb-2">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal list-inside mb-2">{children}</ol>;
              },
              // 自定义链接样式
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
