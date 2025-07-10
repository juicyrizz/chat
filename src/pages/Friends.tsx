import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Clock, Check, X, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { friendsService, profileService } from '../services/api';
import { useRealtime } from '../hooks/useRealtime';

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends');
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { user } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch friends
      const friendsData = await friendsService.getFriends(user.id);
      setFriends(friendsData);

      // Fetch friend requests
      const requestsData = await friendsService.getFriendRequests(user.id);
      setFriendRequests(requestsData);

      // Fetch suggestions (random users not already friends)
      const allUsers = await profileService.searchUsers('');
      const friendIds = friendsData.map((f: any) => f.friend.id);
      const requestIds = requestsData.map((r: any) => r.user.id);
      const suggestionsData = allUsers
        .filter((u: any) => u.id !== user.id && !friendIds.includes(u.id) && !requestIds.includes(u.id))
        .slice(0, 10);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Real-time updates for friendships
  useRealtime('friendships', (payload) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      fetchData();
    }
  });

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendsService.acceptFriendRequest(requestId);
      fetchData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendsService.rejectFriendRequest(requestId);
      fetchData();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleSendRequest = async (userId: string) => {
    if (!user) return;
    
    try {
      await friendsService.sendFriendRequest(user.id, userId);
      setSuggestions(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { id: 'requests', label: 'Requests', icon: Clock, count: friendRequests.length },
    { id: 'suggestions', label: 'Suggestions', icon: UserPlus, count: suggestions.length }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

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
                {friends.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No friends yet</h3>
                    <p className="text-gray-400">Start connecting with people!</p>
                  </div>
                ) : (
                  friends.map((friendship, index) => (
                    <motion.div
                      key={friendship.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {friendship.friend.full_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{friendship.friend.full_name}</h3>
                          <p className="text-sm text-gray-500">@{friendship.friend.username}</p>
                          {friendship.friend.bio && (
                            <p className="text-xs text-gray-400 mt-1">{friendship.friend.bio}</p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {activeTab === 'requests' && (
              <>
                {friendRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No friend requests</h3>
                    <p className="text-gray-400">You're all caught up!</p>
                  </div>
                ) : (
                  friendRequests.map((request, index) => (
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
                            {request.user.full_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.user.full_name}</h3>
                          <p className="text-sm text-gray-500">@{request.user.username}</p>
                          {request.user.bio && (
                            <p className="text-xs text-gray-400 mt-1">{request.user.bio}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(request.id)}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectRequest(request.id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {activeTab === 'suggestions' && (
              <>
                {suggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No suggestions</h3>
                    <p className="text-gray-400">Check back later for new people to connect with!</p>
                  </div>
                ) : (
                  suggestions.map((suggestion, index) => (
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
                          {suggestion.bio && (
                            <p className="text-xs text-gray-400 mt-1">{suggestion.bio}</p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSendRequest(suggestion.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Friend</span>
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Friends;