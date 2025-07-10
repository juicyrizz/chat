import React, { useState } from 'react';
import { Plus, Play, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Stories: React.FC = () => {
  const [stories, setStories] = useState([
    {
      id: '1',
      user: {
        username: 'alice_adventures',
        full_name: 'Alice Johnson',
        avatar_url: null
      },
      content: 'Beautiful sunset today! 🌅',
      image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-15T18:30:00Z',
      expires_at: '2024-01-16T18:30:00Z',
      views: 12
    },
    {
      id: '2',
      user: {
        username: 'bob_creates',
        full_name: 'Bob Smith',
        avatar_url: null
      },
      content: 'Working late but loving it! 💻',
      image_url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-15T20:15:00Z',
      expires_at: '2024-01-16T20:15:00Z',
      views: 8
    }
  ]);

  const [selectedStory, setSelectedStory] = useState<any>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const handleCreateStory = () => {
    // Handle story creation
    console.log('Create story');
  };

  const handleViewStory = (story: any) => {
    setSelectedStory(story);
  };

  const closeStoryViewer = () => {
    setSelectedStory(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-6 mb-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Stories</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateStory}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Story</span>
            </motion.button>
          </div>

          {/* Your Story */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Your Story</h2>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-4 p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors cursor-pointer"
              onClick={handleCreateStory}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Add to your story</h3>
                <p className="text-sm text-gray-500">Share a photo or write something</p>
              </div>
            </motion.div>
          </div>

          {/* Friends' Stories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Friends' Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleViewStory(story)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                >
                  <div className="aspect-[9/16] bg-gradient-to-br from-purple-500 to-pink-500">
                    {story.image_url ? (
                      <img
                        src={story.image_url}
                        alt="Story"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {story.user.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs font-medium">
                          {story.user.full_name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {story.user.full_name}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm mb-2">{story.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-white" />
                          <span className="text-white text-xs">{story.views}</span>
                        </div>
                        <span className="text-white text-xs">
                          {new Date(story.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Story Viewer Modal */}
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeStoryViewer}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[9/16] rounded-xl overflow-hidden">
                {selectedStory.image_url ? (
                  <img
                    src={selectedStory.image_url}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {selectedStory.user.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs font-medium">
                          {selectedStory.user.full_name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {selectedStory.user.full_name}
                      </span>
                    </div>
                    <button
                      onClick={closeStoryViewer}
                      className="text-white hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-lg mb-2">{selectedStory.content}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Stories;