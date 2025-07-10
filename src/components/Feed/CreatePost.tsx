import React, { useState } from 'react';
import { Image, Smile, MapPin, Users, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { postsService } from '../../services/api';

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      const newPost = await postsService.createPost(user.id, content.trim());
      setContent('');
      setShowOptions(false);
      onPostCreated?.(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-6 mb-6`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setShowOptions(true)}
              placeholder="What's on your mind?"
              className={`${inputClasses[theme]} w-full p-4 rounded-xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
              rows={showOptions ? 4 : 2}
              disabled={loading}
            />
            
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                    >
                      <Image className="w-5 h-5" />
                      <span className="text-sm">Photo</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                      <span className="text-sm">Emoji</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm">Location</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-colors"
                    >
                      <Users className="w-5 h-5" />
                      <span className="text-sm">Tag</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setShowOptions(false);
                        setContent('');
                      }}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!content.trim() || loading}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Posting...' : 'Post'}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePost;