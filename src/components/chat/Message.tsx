"use client";

import { cn } from '@/lib/utils';
import { SparklesIcon, UserIcon } from './icons';
import ReactMarkdown from 'react-markdown';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
}

export function MessageComponent({
  message,
}: {
  message: Message;
}) {
  return (
    <div
      className="w-full"
      data-role={message.role}
    >
      <div
        className={cn(
          'flex gap-3',
          message.role === 'user' ? 'justify-end' : 'justify-start',
        )}
      >
        {message.role === 'assistant' && (
          <div className="size-8 flex items-center justify-center shrink-0">
            <div className="text-primary w-7 h-7 flex items-center justify-center">
              <SparklesIcon size={16} />
            </div>
          </div>
        )}

        <div className={cn('flex flex-col max-w-[85%]',
          message.role === 'user' ? 'items-end' : 'items-start'
        )}>
          <div
            data-testid="message-content"
            className={cn('px-0 py-0 text-foreground')}
          >
            {message.role === 'assistant' ? (
              <div className="prose dark:prose-invert max-w-none text-left">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              message.content
            )}
            {message.isStreaming && (
              <span className="ml-1 inline-block w-2 h-4 bg-muted animate-pulse" />
            )}
          </div>
        </div>

        {message.role === 'user' && (
          <div className="size-8 flex items-center justify-center shrink-0">
            <div className="text-foreground w-7 h-7 flex items-center justify-center">
              <UserIcon size={16} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}