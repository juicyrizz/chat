import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image_url?: string;
    created_at: string;
    user: {
      username: string;
      full_name: string;
      avatar_url?: string;
    };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { theme } = useTheme();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${themeClasses[theme]} rounded-2xl border shadow-lg overflow-hidden mb-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
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
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-gray-800 mb-4">{post.content}</p>
        
        {post.image_url && (
          <div className="rounded-xl overflow-hidden mb-4">
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-2 ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">24</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">5</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSaved(!saved)}
            className={`${
              saved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-200 p-4"
        >
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">A</span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-xl p-3">
                  <p className="text-sm font-medium">Alice Johnson</p>
                  <p className="text-sm text-gray-600">Great post! Love the colors.</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;