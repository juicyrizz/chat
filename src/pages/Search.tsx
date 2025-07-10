import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Users, Hash, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/Feed/PostCard';
import { useTheme } from '../contexts/ThemeContext';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'posts' | 'hashtags'>('all');
  const [searchResults, setSearchResults] = useState({
    people: [
      {
        id: '1',
        username: 'alice_adventures',
        full_name: 'Alice Johnson',
        bio: 'Adventure seeker and coffee lover',
        avatar_url: null,
        mutual_friends: 5
      },
      {
        id: '2',
        username: 'bob_creates',
        full_name: 'Bob Smith',
        bio: 'Creative designer and developer',
        avatar_url: null,
        mutual_friends: 3
      }
    ],
    posts: [
      {
        id: '1',
        content: 'Just had the most amazing coffee at the new café downtown! The atmosphere is perfect for working. ☕✨',
        image_url: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800',
        created_at: '2024-01-15T10:30:00Z',
        user: {
          username: 'alice_adventures',
          full_name: 'Alice Johnson',
          avatar_url: null
        }
      }
    ],
    hashtags: [
      { tag: 'coffee', posts: 1234 },
      { tag: 'coding', posts: 856 },
      { tag: 'design', posts: 642 }
    ]
  });

  const { theme } = useTheme();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const tabs = [
    { id: 'all', label: 'All', icon: SearchIcon },
    { id: 'people', label: 'People', icon: Users },
    { id: 'posts', label: 'Posts', icon: Image },
    { id: 'hashtags', label: 'Hashtags', icon: Hash }
  ];

  const filteredResults = () => {
    if (!query) return { people: [], posts: [], hashtags: [] };
    
    return {
      people: searchResults.people.filter(person =>
        person.full_name.toLowerCase().includes(query.toLowerCase()) ||
        person.username.toLowerCase().includes(query.toLowerCase())
      ),
      posts: searchResults.posts.filter(post =>
        post.content.toLowerCase().includes(query.toLowerCase())
      ),
      hashtags: searchResults.hashtags.filter(hashtag =>
        hashtag.tag.toLowerCase().includes(query.toLowerCase())
      )
    };
  };

  const results = filteredResults();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-6 mb-6`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <SearchIcon className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-bold">
              Search Results for "{query}"
            </h1>
          </div>

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
              </button>
            ))}
          </div>

          {/* Results */}
          <div>
            {!query ? (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Start searching</h3>
                <p className="text-gray-400">Enter a search term to find people, posts, and hashtags</p>
              </div>
            ) : (
              <>
                {(activeTab === 'all' || activeTab === 'people') && results.people.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">People</h2>
                    <div className="space-y-3">
                      {results.people.map((person, index) => (
                        <motion.div
                          key={person.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {person.full_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{person.full_name}</h3>
                              <p className="text-sm text-gray-500">@{person.username}</p>
                              <p className="text-xs text-gray-400">{person.mutual_friends} mutual friends</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                            Follow
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Posts</h2>
                    <div className="space-y-6">
                      {results.posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'hashtags') && results.hashtags.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Hashtags</h2>
                    <div className="space-y-3">
                      {results.hashtags.map((hashtag, index) => (
                        <motion.div
                          key={hashtag.tag}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Hash className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">#{hashtag.tag}</h3>
                              <p className="text-sm text-gray-500">{hashtag.posts} posts</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {results.people.length === 0 && results.posts.length === 0 && results.hashtags.length === 0 && (
                  <div className="text-center py-12">
                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No results found</h3>
                    <p className="text-gray-400">Try searching for something else</p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Search;