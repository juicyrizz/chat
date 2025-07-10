import React, { useState } from 'react';
import { Bookmark, Heart, MessageCircle, Share } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';

const Saved: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState([
    {
      id: '1',
      content: 'Just had the most amazing coffee at the new café downtown! The atmosphere is perfect for working and the barista art is incredible. ☕✨',
      image_url: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-15T10:30:00Z',
      saved_at: '2024-01-15T11:00:00Z',
      user: {
        username: 'alice_adventures',
        full_name: 'Alice Johnson',
        avatar_url: null
      },
      likes: 24,
      comments: 5
    },
    {
      id: '2',
      content: 'Working on a new project and feeling inspired! Sometimes the best ideas come when you least expect them. 🌅',
      image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-14T20:45:00Z',
      saved_at: '2024-01-14T21:15:00Z',
      user: {
        username: 'bob_creates',
        full_name: 'Bob Smith',
        avatar_url: null
      },
      likes: 18,
      comments: 3
    }
  ]);

  const { theme } = useTheme();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const handleUnsave = (postId: string) => {
    setSavedPosts(savedPosts.filter(post => post.id !== postId));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-6 mb-6`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Bookmark className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-bold">Saved Posts</h1>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
              {savedPosts.length}
            </span>
          </div>

          {savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No saved posts yet</h3>
              <p className="text-gray-400">Posts you save will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {savedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${themeClasses[theme]} rounded-xl border p-4`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {post.user.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{post.user.full_name}</h3>
                        <p className="text-sm text-gray-500">@{post.user.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Saved {formatDistanceToNow(new Date(post.saved_at), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-gray-400">
                        Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    
                    {post.image_url && (
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={post.image_url}
                          alt="Post content"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </div>

                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Share className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUnsave(post.id)}
                      className="text-yellow-500 hover:text-yellow-600 transition-colors"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Saved;