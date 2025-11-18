"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import {
  MessageCircle,
  X,
  Send,
  User,
  Users,
  Calendar,
  HelpCircle,
  Search,
  Plus,
  Minimize2,
  Maximize2,
  Loader2,
  Check,
  CheckCheck,
} from 'lucide-react';
import type { Conversation, ChatMessage } from './AppContext';

export default function Chat() {
  const { user, conversations, sendMessage, markMessagesAsRead, getConversationMessages, getTotalUnreadCount, addConversation, events } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unreadCount = getTotalUnreadCount();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConversation) {
      scrollToBottom();
    }
  }, [activeConversation, getConversationMessages(activeConversation?.id || '')]);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    markMessagesAsRead(conversation.id);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId: activeConversation.id,
      senderId: user.id,
      senderName: user.name,
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };

    sendMessage(newMessage);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateEventChat = (eventId: string) => {
    if (!user) return;

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const newConversation: Conversation = {
      id: `event-${eventId}-${Date.now()}`,
      type: 'event',
      participants: [user.id],
      participantNames: [user.name],
      eventId: eventId,
      eventTitle: event.title,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };

    addConversation(newConversation);
    setShowNewChatModal(false);
    setActiveConversation(newConversation);
  };

  const handleCreateSupportChat = () => {
    if (!user) return;

    const newConversation: Conversation = {
      id: `support-${Date.now()}`,
      type: 'support',
      participants: [user.id, 'admin'],
      participantNames: [user.name, 'Support Team'],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };

    addConversation(newConversation);
    setShowNewChatModal(false);
    setActiveConversation(newConversation);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.participantNames.some(name => name.toLowerCase().includes(query)) ||
      conv.eventTitle?.toLowerCase().includes(query) ||
      conv.lastMessage?.content.toLowerCase().includes(query)
    );
  });

  const getConversationIcon = (conversation: Conversation) => {
    switch (conversation.type) {
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'support':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.type === 'event') {
      return conversation.eventTitle || 'Event Chat';
    }
    if (conversation.type === 'support') {
      return 'Support Team';
    }
    return conversation.participantNames.filter(name => name !== user?.name).join(', ') || 'Direct Message';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-slate-800 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group z-40"
        aria-label="Open Chat"
      >
        <MessageCircle className="w-8 h-8" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isMinimized ? 'bottom-24 right-6 w-80' : 'bottom-24 right-6 w-[800px]'
      } ${
        isMinimized ? 'h-16' : 'h-[600px]'
      } bg-white rounded-2xl shadow-2xl flex z-40 transition-all duration-300 border border-slate-200`}
    >
      {!isMinimized && (
        <>
          {/* Conversations List */}
          <div className="w-80 border-r border-slate-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-800 text-white rounded-tl-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Messages</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="New conversation"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-600 text-sm mb-2">No conversations yet</p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="text-slate-800 font-medium text-sm hover:underline"
                  >
                    Start a conversation
                  </button>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                      activeConversation?.id === conversation.id ? 'bg-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                        {getConversationIcon(conversation)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm text-slate-800 truncate">
                            {getConversationTitle(conversation)}
                          </p>
                          {conversation.lastMessage && (
                            <span className="text-xs text-slate-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-slate-600 truncate">
                            {conversation.lastMessage.senderName === user.name ? 'You: ' : ''}
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      {getConversationIcon(activeConversation)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">
                        {getConversationTitle(activeConversation)}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {activeConversation.type === 'event' && 'Event Discussion'}
                        {activeConversation.type === 'support' && 'Support Chat'}
                        {activeConversation.type === 'direct' && 'Direct Message'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getConversationMessages(activeConversation.id).map((message) => {
                    const isOwn = message.senderId === user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isOwn
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {!isOwn && (
                            <p className="text-xs font-semibold mb-1 opacity-70">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isOwn && (
                              message.read ? (
                                <CheckCheck className="w-3 h-3 opacity-70" />
                              ) : (
                                <Check className="w-3 h-3 opacity-70" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    Select a conversation
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">
                    Choose a conversation from the list or start a new one
                  </p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    New Conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {isMinimized && (
        <div className="flex items-center justify-between w-full p-4 bg-slate-800 text-white rounded-2xl">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">Messages</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">New Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCreateSupportChat}
                className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-800">Support Team</p>
                  <p className="text-sm text-slate-600">Get help with your questions</p>
                </div>
              </button>

              {events.length > 0 && (
                <>
                  <p className="text-sm font-semibold text-slate-600 pt-2">Event Discussions</p>
                  {events.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleCreateEventChat(event.id)}
                      className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                    >
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-slate-800 truncate">{event.title}</p>
                        <p className="text-sm text-slate-600">{event.category}</p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
