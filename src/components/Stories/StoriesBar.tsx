import React, { useState, useEffect } from 'react';
import { Plus, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { storiesService } from '../../services/api';
import { useRealtime } from '../../hooks/useRealtime';

const StoriesBar: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { user } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-800 border-gray-700',
    gray: 'bg-gray-200 border-gray-300',
    chroma: 'bg-gray-900/40 border-gray-800/30 backdrop-blur-xl'
  };

  const fetchStories = async () => {
    try {
      const data = await storiesService.getStories();
      
      // Group stories by user
      const groupedStories = data.reduce((acc: any, story: any) => {
        if (!acc[story.user_id]) {
          acc[story.user_id] = {
            user: story.user,
            stories: []
          };
        }
        acc[story.user_id].stories.push(story);
        return acc;
      }, {});

      setStories(Object.values(groupedStories));
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Real-time updates for stories
  useRealtime('stories', (payload) => {
    if (payload.eventType === 'INSERT') {
      fetchStories();
    }
  });

  const handleCreateStory = async () => {
    if (!user) return;
    
    const content = prompt('What\'s on your mind?');
    if (!content) return;

    try {
      await storiesService.createStory(user.id, content);
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  if (loading) {
    return (
      <div className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-4 mb-6`}>
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-4 mb-6`}
    >
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {/* Your Story */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 text-center cursor-pointer group"
          onClick={handleCreateStory}
        >
          <div className="relative w-16 h-16 rounded-full p-0.5 bg-gray-300">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Plus className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-xs mt-2 text-gray-600 group-hover:text-gray-800 transition-colors">
            Your Story
          </p>
        </motion.div>

        {/* Friends' Stories */}
        {stories.map((storyGroup, index) => (
          <motion.div
            key={storyGroup.user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index + 1) * 0.1 }}
            className="flex-shrink-0 text-center cursor-pointer group"
          >
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {storyGroup.user.full_name.charAt(0)}
                  </span>
                </div>
              </div>
              
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            
            <p className="text-xs mt-2 text-gray-600 group-hover:text-gray-800 transition-colors">
              {storyGroup.user.full_name.split(' ')[0]}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoriesBar;