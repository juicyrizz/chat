import React from 'react';
import { Plus, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const StoriesBar: React.FC = () => {
  const { theme } = useTheme();

  const themeClasses = {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-800 border-gray-700',
    gray: 'bg-gray-200 border-gray-300',
    chroma: 'bg-gray-900/40 border-gray-800/30 backdrop-blur-xl'
  };

  const stories = [
    { id: 1, user: 'Your Story', hasStory: false, isYours: true },
    { id: 2, user: 'Alice', hasStory: true, isYours: false },
    { id: 3, user: 'Bob', hasStory: true, isYours: false },
    { id: 4, user: 'Carol', hasStory: true, isYours: false },
    { id: 5, user: 'David', hasStory: true, isYours: false },
    { id: 6, user: 'Emma', hasStory: true, isYours: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-4 mb-6`}
    >
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 text-center cursor-pointer group"
          >
            <div className={`relative w-16 h-16 rounded-full p-0.5 ${
              story.hasStory && !story.isYours 
                ? 'bg-gradient-to-tr from-purple-500 to-pink-500' 
                : story.isYours 
                ? 'bg-gray-300' 
                : 'bg-gray-200'
            }`}>
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                {story.isYours ? (
                  <Plus className="w-6 h-6 text-gray-600" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {story.user.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {story.hasStory && !story.isYours && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-current" />
                </div>
              )}
            </div>
            
            <p className="text-xs mt-2 text-gray-600 group-hover:text-gray-800 transition-colors">
              {story.user}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoriesBar;