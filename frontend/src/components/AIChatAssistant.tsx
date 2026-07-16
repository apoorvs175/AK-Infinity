import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageSquare, Loader2, Copy, Check } from 'lucide-react';
import type { AIMessage } from '../types';
import { API_URL } from '../lib/api';

interface AIChatAssistantProps {
  clientId: string;
}

export default function AIChatAssistant({ clientId }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Load chat history
  useEffect(() => {
    if (!clientId) return;
    
    const loadData = async () => {
      setLoadingHistory(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/chat/${clientId}/conversation`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        } else {
          setError('Failed to load chat history');
        }
      } catch (err) {
        console.error('Error loading chat:', err);
        setError('Network error');
      } finally {
        setLoadingHistory(false);
      }
    };
    loadData();
  }, [clientId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/chat/${clientId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          data.userMessage,
          data.assistantMessage,
        ]);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [clientId, input, loading]);

  const handleCopyMessage = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Simple markdown-like formatting
  const formatMessage = useCallback((content: string) => {
    return content.split('\n').map((line, idx) => (
      <p key={idx} className="mb-2 last:mb-0">
        {line}
      </p>
    ));
  }, []);

  return (
    <section className="mb-8">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-[#0B132B]">AI Chat Assistant</h2>
        <p className="text-slate-500 mt-1">Ask anything about this client</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-[500px] overflow-y-auto bg-slate-50">
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              <p className="text-slate-500 text-sm">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-700 font-medium text-lg">How can I help you today?</p>
                <p className="text-slate-500 text-sm mt-1">Ask about this client or anything you need help with!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 px-4 py-6 ${msg.role === 'user' ? 'bg-white' : 'bg-slate-50'}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                    {msg.role === 'user' ? (
                      <div className="bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-medium">
                        You
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-[#EAB308] to-orange-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 max-w-3xl">
                    <div className="relative group">
                      <div className="text-base text-slate-800">
                        {formatMessage(msg.content)}
                      </div>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500 hover:text-slate-700"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {loading && (
                <div className="flex gap-4 px-4 py-6 bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308] to-orange-500 flex items-center justify-center mt-1">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end bg-slate-100 rounded-xl border border-slate-200 focus-within:border-[#EAB308] focus-within:ring-1 focus-within:ring-[#EAB308]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message the AI Assistant..."
                disabled={loading}
                className="flex-1 p-3 bg-transparent border-none focus:outline-none resize-none text-base max-h-[200px]"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="flex items-center justify-center w-10 h-10 mb-2 mr-2 bg-gradient-to-br from-[#EAB308] to-orange-500 hover:from-[#d4a207] hover:to-orange-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
