
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([
    {
      role: 'assistant',
      content: 'Hi! I am Cogni, your knowledge assistant. Ask me anything about this project!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    // Simulate response - in a real app, this would be an API call
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm a demo chatbot. In the full version, I'll be connected to the knowledge graph and can help you explore and understand the content better!"
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-4'
                  : 'bg-muted text-foreground mr-4'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-lg px-4 py-2 mr-4">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the project..."
          className="resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" className="shrink-0" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
