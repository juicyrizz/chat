import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import StoriesBar from '../components/Stories/StoriesBar';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import { useTheme } from '../contexts/ThemeContext';
import { postsService } from '../services/api';
import { useRealtime } from '../hooks/useRealtime';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchPosts = async () => {
    try {
      const data = await postsService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Real-time updates for new posts
  useRealtime('posts', (payload) => {
    if (payload.eventType === 'INSERT') {
      setPosts(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'DELETE') {
      setPosts(prev => prev.filter(post => post.id !== payload.old.id));
    }
  });

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StoriesBar />
          <CreatePost onPostCreated={handlePostCreated} />
          
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500 mb-2">No posts yet</h3>
                <p className="text-gray-400">Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;