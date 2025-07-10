import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Clock, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends');
  const [friends, setFriends] = useState([
    {
      id: '1',
      username: 'alice_adventures',
      full_name: 'Alice Johnson',
      avatar_url: null,
      status: 'accepted',
      mutual_friends: 5,
      online: true
    },
    {
      id: '2',
      username: 'bob_creates',
      full_name: 'Bob Smith',
      avatar_url: null,
      status: 'accepted',
      mutual_friends: 3,
      online: false
    }
  ]);

  const [friendRequests, setFriendRequests] = useState([
    {
      id: '3',
      username: 'carol_reads',
      full_name: 'Carol Davis',
      avatar_url: null,
      status: 'pending',
      mutual_friends: 2
    }
  ]);

  const [suggestions, setSuggestions] = useState([
    {
      id: '4',
      username: 'david_codes',
      full_name: 'David Wilson',
      avatar_url: null,
      mutual_friends: 4
    },
    {
      id: '5',
      username: 'emma_designs',
      full_name: 'Emma Brown',
      avatar_url: null,
      mutual_friends: 1
    }
  ]);

  const { theme } = useTheme();
  const { user } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (request) {
      setFriends([...friends, { ...request, status: 'accepted', online: false }]);
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  const handleSendRequest = (userId: string) => {
    setSuggestions(suggestions.filter(user => user.id !== userId));
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { id: 'requests', label: 'Requests', icon: Clock, count: friendRequests.length },
    { id: 'suggestions', label: 'Suggestions', icon: UserPlus, count: suggestions.length }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-6 mb-6`}
        >
          <h1 className="text-2xl font-bold mb-6">Friends</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === 'friends' && (
              <>
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
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
                      <div>
                        <h3 className="font-semibold">{friend.full_name}</h3>
                        <p className="text-sm text-gray-500">@{friend.username}</p>
                        <p className="text-xs text-gray-400">{friend.mutual_friends} mutual friends</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors">
                      Message
                    </button>
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === 'requests' && (
              <>
                {friendRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {request.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.full_name}</h3>
                        <p className="text-sm text-gray-500">@{request.username}</p>
                        <p className="text-xs text-gray-400">{request.mutual_friends} mutual friends</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === 'suggestions' && (
              <>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {suggestion.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{suggestion.full_name}</h3>
                        <p className="text-sm text-gray-500">@{suggestion.username}</p>
                        <p className="text-xs text-gray-400">{suggestion.mutual_friends} mutual friends</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(suggestion.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      Add Friend
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Friends;