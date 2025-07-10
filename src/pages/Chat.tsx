import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import ChatWindow from '../components/Chat/ChatWindow';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Chat: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [friends, setFriends] = useState([
    {
      id: '1',
      username: 'alice_adventures',
      full_name: 'Alice Johnson',
      avatar_url: null,
      lastMessage: 'Hey! How are you doing?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      online: true
    },
    {
      id: '2',
      username: 'bob_creates',
      full_name: 'Bob Smith',
      avatar_url: null,
      lastMessage: 'Thanks for the help yesterday!',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      online: false
    },
    {
      id: '3',
      username: 'carol_reads',
      full_name: 'Carol Davis',
      avatar_url: null,
      lastMessage: 'Did you see the new episode?',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      online: true
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Hey! How are you doing?',
      sender_id: '1',
      created_at: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished a big project at work. How about you?',
      sender_id: 'current_user',
      created_at: '2024-01-15T10:32:00Z',
      read: true
    },
    {
      id: '3',
      content: 'That\'s awesome! I\'ve been working on some new designs. Want to see them?',
      sender_id: '1',
      created_at: '2024-01-15T10:35:00Z',
      read: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const { user } = useAuth();

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

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender_id: user?.id || 'current_user',
      created_at: new Date().toISOString(),
      read: false
    };
    setMessages([...messages, newMessage]);
  };

  const filteredFriends = friends.filter(friend =>
    friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex h-screen pt-16">
        {/* Friends List */}
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
              {filteredFriends.map((friend, index) => (
                <motion.button
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedFriend(friend)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    selectedFriend?.id === friend.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {friend.full_name.charAt(0)}
                      </span>
                    </div>
                    {friend.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{friend.full_name}</h3>
                      <span className="text-xs text-gray-500">{friend.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">{friend.lastMessage}</p>
                      {friend.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {friend.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 p-6">
          <ChatWindow
            selectedFriend={selectedFriend}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;