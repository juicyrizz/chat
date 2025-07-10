import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Video, MoreVertical, Send, Smile, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { messagesService } from '../services/api';
import { useRealtimeMessages } from '../hooks/useRealtime';

const Chat: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { user } = useAuth();

  const { messages, loading: messagesLoading } = useRealtimeMessages(
    user?.id || '',
    selectedFriend?.partner?.id || ''
  );

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/60 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const inputClasses = {
    light: 'bg-gray-50 text-gray-900 placeholder-gray-500',
    dark: 'bg-gray-700 text-white placeholder-gray-400',
    gray: 'bg-gray-100 text-gray-900 placeholder-gray-600',
    chroma: 'bg-gray-800/40 text-gray-100 placeholder-gray-400 backdrop-blur-sm'
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const data = await messagesService.getConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend || !user) return;

    try {
      await messagesService.sendMessage(
        user.id,
        selectedFriend.partner.id,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partner.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.partner.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex h-screen pt-16">
          <div className="flex items-center justify-center w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen pt-16">
        {/* Conversations List */}
        <div className={`w-80 ${themeClasses[theme]} border-r shadow-lg`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Messages</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClasses[theme]} w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
              />
            </div>
            
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400">Start chatting with your friends!</p>
                </div>
              ) : (
                filteredConversations.map((conversation, index) => (
                  <motion.button
                    key={conversation.partner.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedFriend(conversation)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      selectedFriend?.partner?.id === conversation.partner.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {conversation.partner.full_name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{conversation.partner.full_name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessage.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {!selectedFriend ? (
            <div className={`${themeClasses[theme]} flex-1 flex items-center justify-center`}>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className={`${themeClasses[theme]} flex items-center justify-between p-4 border-b`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {selectedFriend.partner.full_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedFriend.partner.full_name}</h3>
                    <p className="text-sm text-gray-500">@{selectedFriend.partner.username}</p>
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
              <div className={`${themeClasses[theme]} flex-1 overflow-y-auto p-4 space-y-4`}>
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
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
                )}
              </div>

              {/* Message Input */}
              <div className={`${themeClasses[theme]} p-4 border-t`}>
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;