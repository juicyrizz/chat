import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { postsService, commentsService } from '../../services/api';

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
    likes?: any[];
    comments?: any[];
  };
  onUpdate?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Get likes
        const likes = await postsService.getPostLikes(post.id);
        setLikesCount(likes.length);
        setLiked(likes.some(like => like.user_id === user?.id));

        // Get comments
        const postComments = await commentsService.getComments(post.id);
        setComments(postComments);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [post.id, user?.id]);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await postsService.unlikePost(user.id, post.id);
        setLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await postsService.likePost(user.id, post.id);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const comment = await commentsService.createComment(user.id, post.id, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
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
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.length}</span>
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
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200"
          >
            {/* Comment Form */}
            <form onSubmit={handleComment} className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || loading}
                    className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        {comment.user.full_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-xl p-3">
                        <p className="text-sm font-medium">{comment.user.full_name}</p>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;