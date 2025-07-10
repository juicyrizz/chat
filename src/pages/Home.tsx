import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import StoriesBar from '../components/Stories/StoriesBar';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      content: 'Just had the most amazing coffee at the new café downtown! The atmosphere is perfect for working and the barista art is incredible. Highly recommend to anyone looking for a cozy spot to get work done. ☕✨',
      image_url: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-15T10:30:00Z',
      user: {
        username: 'alice_adventures',
        full_name: 'Alice Johnson',
        avatar_url: null
      }
    },
    {
      id: '2',
      content: 'Working on a new project and feeling inspired! Sometimes the best ideas come when you least expect them. This sunset view from my office window is definitely helping with the creative process. 🌅',
      image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-15T08:15:00Z',
      user: {
        username: 'bob_creates',
        full_name: 'Bob Smith',
        avatar_url: null
      }
    },
    {
      id: '3',
      content: 'Finally finished reading this incredible book! The storytelling was absolutely captivating and I couldn\'t put it down. Already looking forward to the next one in the series. What\'s everyone else reading these days? 📚',
      image_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-14T20:45:00Z',
      user: {
        username: 'carol_reads',
        full_name: 'Carol Davis',
        avatar_url: null
      }
    }
  ]);

  const { theme } = useTheme();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StoriesBar />
          <CreatePost />
          
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;