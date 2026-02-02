'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, MoreVertical, Paperclip, Smile, Code } from 'lucide-react';
import { useChat, useAuth } from '@/store/appStore';
import { formatDistanceToNow } from 'date-fns';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const {
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    fetchMessages,
    addMessage,
  } = useChat();

  const { currentUser } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Get active chat messages
  const activeChatMessages = activeChat ? messages[activeChat] || [] : [];

  // Initialize Socket.IO
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem('accessToken');
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      query: { userId: currentUser._id },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('new_message', (message) => {
      addMessage(message);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !activeChat || isSending) return;

    setIsSending(true);
    
    try {
      await sendMessage(activeChat, messageInput.trim());
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Select a Chat</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Choose a conversation from your matches to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Chat Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveChat(null)}
              className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-pink-500 shrink-0">
              <img
                src="/placeholder-user.jpg"
                alt="User"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <div>
              <h2 className="text-lg font-bold">John Doe</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Online</p>
            </div>
          </div>

          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {activeChatMessages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUser?._id;
            const showAvatar = 
              index === 0 || 
              activeChatMessages[index - 1].senderId !== message.senderId;

            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-pink-500 shrink-0">
                    {showAvatar && (
                      <img
                        src="/placeholder-user.jpg"
                        alt="User"
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    isOwnMessage
                      ? 'bg-violet-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-violet-200' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {/* Spacer for own messages */}
                {isOwnMessage && <div className="w-8" />}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Paperclip className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          <button
            type="button"
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Code className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="button"
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          <button
            type="submit"
            disabled={!messageInput.trim() || isSending}
            className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}