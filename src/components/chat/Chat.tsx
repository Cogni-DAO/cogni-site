"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SendIcon, StopIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message, MessageComponent } from "./Message";
import { SuggestedActions } from "./SuggestedActions";
import { motion, AnimatePresence } from "framer-motion";
import { generateUUID } from "@/lib/utils";
import type { ChatRequest } from "@/utils/chat";
import { createChatRequest } from "@/utils/chat";

// Manual SSE parsing for reliable streaming

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [userRequestedStop, setUserRequestedStop] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create refs to track state in async contexts
  const isStreamingRef = useRef(false);
  const userRequestedStopRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  useEffect(() => {
    userRequestedStopRef.current = userRequestedStop;
  }, [userRequestedStop]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    const container = document.querySelector('.cogni-panel-content');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [input]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '40px';
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const stopStreaming = () => {
    setUserRequestedStop(true);
    userRequestedStopRef.current = true;

    // Mark messages as not streaming
    setMessages(messages => messages.map(message => ({
      ...message,
      isStreaming: false
    })));
  };

  const sendMessage = useCallback(async (userMessage: string) => {
    // Reset the user stop flag at the beginning of a new message
    setUserRequestedStop(false);
    userRequestedStopRef.current = false;

    if (!userMessage.trim()) return;

    // Add user message to chat
    const newUserMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    resetHeight();

    // Create a placeholder for the assistant's message
    const assistantMessageId = generateUUID();
    const placeholderMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true
    };

    setMessages(prev => [...prev, placeholderMessage]);
    setIsStreaming(true);
    isStreamingRef.current = true;

    try {
      // Create a validated request payload  
      const chatRequest: ChatRequest = createChatRequest(userMessage);

      // Send the request to the API with streaming enabled
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatRequest),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status} ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body reader available");
      }

      // Read the stream
      const decoder = new TextDecoder();
      let streamedContent = "";
      let buffer = ""; // Buffer for incomplete lines

      while (isStreamingRef.current && !userRequestedStopRef.current) {
        try {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines from buffer
          const lines = buffer.split('\n');
          // Keep the last potentially incomplete line in buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const payload = JSON.parse(line.slice(5).trim());
                // Backend sends array with first element being the AI message chunk
                const aiMsg = payload[0];
                if (aiMsg && aiMsg.content !== undefined && aiMsg.type === 'AIMessageChunk') {
                  streamedContent += aiMsg.content;
                }
              } catch { }
            }
          }

          // Update the UI with each chunk
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: streamedContent }
                : msg
            )
          );
        } catch (error) {
          console.error("Error reading stream:", error);
          break;
        }
      }

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error("Error details:", error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, I encountered an error. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      // Only set isStreaming to false here, after all stream processing is complete
      setIsStreaming(false);
      isStreamingRef.current = false;

      // Reset the user stop flag
      setUserRequestedStop(false);
      userRequestedStopRef.current = false;
    }
  }, []);

  // Define this after sendMessage so we can include it in dependencies
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    sendMessage(suggestion);
  }, [sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) return;
    sendMessage(input);
  };

  // Add this at the top of your component:
  useEffect(() => {
    // Initialize the flag
    setUserRequestedStop(false);

    // Clean up
    return () => {
      // delete window.userRequestedStop; // Removed problematic delete
    };
  }, []);

  console.log("[Chat] Rendering component. Messages count:", messages.length); // Log Chat render

  return (
    <div className="w-full flex flex-col h-[600px] rounded-lg overflow-hidden border-2 border-border">

      <div className="flex-1 overflow-y-auto flex flex-col space-y-4 p-4 bg-background">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-6 items-center justify-center text-muted-foreground p-4"
            >
              <p className="text-center text-lg">Chat with Cogni to learn about the project</p>
              <SuggestedActions onSuggestionClick={handleSuggestionClick} />
            </motion.div>
          ) : (
            messages.map((message) => (
              <MessageComponent
                key={message.id}
                message={message}
              />
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="resize-none min-h-[40px] max-h-[40px] pr-12 bg-background border-input rounded-full py-2 px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring"
            disabled={isStreaming}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isStreaming) {
                  handleSubmit(e);
                }
              }
            }}
          />

          <div className="absolute right-3 bottom-[5px]">
            {isStreaming ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground"
                onClick={stopStreaming}
                aria-label="Stop generating"
              >
                <StopIcon />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <SendIcon />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}