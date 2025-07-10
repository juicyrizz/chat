import React, { useState } from 'react';
import { Edit, MapPin, Calendar, Link as LinkIcon, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/Feed/PostCard';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useAuth();
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    username: 'john_doe',
    full_name: 'John Doe',
    bio: 'Software developer passionate about creating amazing user experiences. Love coffee, coding, and connecting with people.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joined: '2023-01-15',
    posts_count: 42,
    friends_count: 156,
    followers_count: 234
  });

  const [userPosts] = useState([
    {
      id: '1',
      content: 'Just finished working on a new React component library! Excited to share it with the community soon. 🚀',
      image_url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: '2024-01-15T10:30:00Z',
      user: {
        username: 'john_doe',
        full_name: 'John Doe',
        avatar_url: null
      }
    }
  ]);

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const tabs = [
    { id: 'posts', label: 'Posts', count: profile.posts_count },
    { id: 'about', label: 'About', count: null },
    { id: 'friends', label: 'Friends', count: profile.friends_count }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg overflow-hidden mb-6`}
        >
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 relative">
            <button className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/30 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 relative">
              {/* Profile Picture */}
              <div className="relative mb-4 md:mb-0">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {profile.full_name.charAt(0)}
                  </span>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                    <p className="text-gray-500">@{profile.username}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                </div>

                <p className="mt-4 text-gray-600">{profile.bio}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={profile.website} className="text-purple-500 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile.joined).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex space-x-6 mt-4">
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.posts_count}</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.friends_count}</div>
                    <div className="text-sm text-gray-500">Friends</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.followers_count}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg mb-6`}
        >
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-500 text-purple-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Location:</strong> {profile.location}</p>
                    <p><strong>Website:</strong> <a href={profile.website} className="text-purple-500 hover:underline">{profile.website}</a></p>
                    <p><strong>Joined:</strong> {new Date(profile.joined).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock friends data */}
                {[1, 2, 3, 4, 5, 6].map((friend) => (
                  <div key={friend} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">F{friend}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Friend {friend}</h4>
                      <p className="text-sm text-gray-500">@friend{friend}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;