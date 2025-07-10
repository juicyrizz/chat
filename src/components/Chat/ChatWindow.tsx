import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

interface ChatWindowProps {
  selectedFriend: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedFriend, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const inputClasses = {
    light: 'bg-gray-50 text-gray-900 placeholder-gray-500',
    dark: 'bg-gray-700 text-white placeholder-gray-400',
    gray: 'bg-gray-100 text-gray-900 placeholder-gray-600',
    chroma: 'bg-gray-800/30 text-gray-100 placeholder-gray-400 backdrop-blur-sm'
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedFriend) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!selectedFriend) {
    return (
      <div className={`${themeClasses[theme]} rounded-2xl border shadow-lg flex-1 flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses[theme]} rounded-2xl border shadow-lg flex-1 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {selectedFriend.full_name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{selectedFriend.full_name}</h3>
            <p className="text-sm text-gray-500">@{selectedFriend.username}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Video className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender_id === user?.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === user?.id ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className={`${inputClasses[theme]} w-full px-4 py-2 pr-12 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;