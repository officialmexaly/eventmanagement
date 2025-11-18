"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Minimize2, Maximize2, X, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from './AppContext';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
}

const CustomAI: React.FC = () => {
  const { events, isAdmin } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check server status on mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('/api/custom-ai', { method: 'GET' });
      const data = await response.json();
      setServerStatus(data.status === 'online' ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/custom-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.fallback || data.error) {
        // Server is down, show error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Custom AI is currently unavailable. ${data.message || data.error}\n\nPlease try the Claude AI assistant instead (click the purple chat icon).`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setServerStatus('offline');
      } else {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setServerStatus('online');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Failed to connect to custom AI server. Please make sure the inference server is running.\n\nYou can use the Claude AI assistant instead (purple chat icon).',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setServerStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What events are happening this weekend?",
    "Show me tech conferences in Lagos",
    "How do I book tickets?",
    "Tell me about EventHub features",
  ];

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-110 z-40 flex items-center justify-center group"
        title="EventHub Custom AI (Llama 3)"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        {serverStatus === 'offline' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isMinimized ? 'bottom-24 right-6 w-96' : 'bottom-6 right-6 w-[28rem]'
      } bg-white rounded-3xl shadow-2xl border border-slate-200 z-40 transition-all duration-300`}
      style={{ height: isMinimized ? 'auto' : '600px' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">EventHub Custom AI</h3>
            <p className="text-xs text-emerald-100 flex items-center space-x-2">
              <span>Powered by Llama 3</span>
              {serverStatus === 'online' && <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>}
              {serverStatus === 'offline' && <span className="w-2 h-2 bg-red-300 rounded-full"></span>}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Server Status Warning */}
          {serverStatus === 'offline' && (
            <div className="bg-amber-50 border-b border-amber-200 p-3">
              <div className="flex items-center space-x-2 text-amber-800 text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-medium">Custom AI Offline</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Start the inference server: <code className="bg-amber-100 px-1 rounded">python ml/inference_server.py</code>
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">
                  Welcome to EventHub Custom AI!
                </h4>
                <p className="text-slate-600 text-sm mb-6">
                  This is your custom-trained Llama 3 model, specifically fine-tuned for EventHub.
                </p>

                {/* Suggested Questions */}
                <div className="text-left max-w-sm mx-auto">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                    Try asking:
                  </p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestion(question)}
                        className="w-full text-left px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-sm text-slate-700 hover:text-emerald-700"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-sm text-slate-600">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-3xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={serverStatus === 'online' ? "Ask me anything about events..." : "Custom AI offline - please start the server"}
                disabled={isLoading || serverStatus === 'offline'}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || serverStatus === 'offline'}
                className="px-6 py-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {serverStatus === 'online' && (
              <p className="text-xs text-slate-500 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Using your custom EventHub AI model
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomAI;
