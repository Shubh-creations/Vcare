import React, { useRef, useEffect } from 'react';
import { Message, AgentStatus } from '../types';
import MessageRenderer from './MessageRenderer';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  activeAgent: AgentStatus | undefined;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isLoading, 
  input, 
  setInput, 
  onSend,
  activeAgent
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeAgent]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
       {/* Background Grid Effect */}
       <div className="absolute inset-0 z-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
       ></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {messages.length === 0 && (
            <div className="mt-20 text-center space-y-4 opacity-50">
               <div className="inline-block p-4 rounded-full bg-surfaceHighlight border border-border">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
               </div>
               <h3 className="text-xl font-medium text-white">Life-OS Prime Initialized</h3>
               <p className="text-sm text-gray-400">Systems Nominal. Ready to optimize.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[90%] md:max-w-[80%] rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm
                  ${msg.role === 'user' 
                    ? 'bg-white/10 text-white border border-white/10 rounded-br-none' 
                    : 'bg-surfaceHighlight/80 text-gray-100 border border-border rounded-bl-none'
                  }
                `}
              >
                {msg.role === 'model' && (
                  <div className="mb-3 flex items-center gap-2 opacity-50 border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                      {msg.agent || 'LIFE-OS PRIME'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                )}
                <MessageRenderer content={msg.text} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-surfaceHighlight/50 border border-border rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs font-mono text-gray-400 animate-pulse">
                     {activeAgent ? `${activeAgent.name.toUpperCase()} ANALYZING...` : 'ORCHESTRATING...'}
                  </span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-surface/50 border-t border-border backdrop-blur-md z-20">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && onSend()}
            placeholder="Enter directives or state update..."
            className="w-full bg-black/40 border border-border text-white rounded-xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner font-mono text-sm"
            disabled={isLoading}
          />
          <button 
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-primary hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-center">
            <p className="text-[10px] text-gray-600">
               LIFE-OS PRIME v2.5.0 // DO NOT INPUT REAL SENSITIVE DATA FOR DEMO
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
