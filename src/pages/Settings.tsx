import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    messages: true,
    friendRequests: true,
    stories: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    messageRequests: 'friends',
    storyVisibility: 'friends'
  });

  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/40 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const settingSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Edit Profile', action: () => console.log('Edit profile') },
        { label: 'Change Password', action: () => console.log('Change password') },
        { label: 'Email Preferences', action: () => console.log('Email preferences') }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Privacy Settings', action: () => console.log('Privacy settings') },
        { label: 'Blocked Users', action: () => console.log('Blocked users') },
        { label: 'Two-Factor Authentication', action: () => console.log('2FA') }
      ]
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { label: 'Help Center', action: () => console.log('Help center') },
        { label: 'Contact Support', action: () => console.log('Contact support') },
        { label: 'Report a Problem', action: () => console.log('Report problem') }
      ]
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses[theme]} rounded-2xl border shadow-lg p-6 mb-6`}
        >
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="space-y-8">
            {/* Theme Settings */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Appearance</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'light', label: 'Light', preview: 'bg-white border-gray-200' },
                  { value: 'dark', label: 'Dark', preview: 'bg-gray-800 border-gray-700' },
                  { value: 'gray', label: 'Gray', preview: 'bg-gray-200 border-gray-300' },
                  { value: 'chroma', label: 'Chroma', preview: 'bg-gradient-to-br from-gray-900 to-gray-800' }
                ].map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      theme === themeOption.value
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-full h-8 rounded ${themeOption.preview} mb-2`}></div>
                    <span className="text-sm font-medium">{themeOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Privacy</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message Requests</label>
                  <select
                    value={privacy.messageRequests}
                    onChange={(e) => setPrivacy({ ...privacy, messageRequests: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                    <option value="none">No One</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Other Settings */}
            {settingSections.map((section, index) => (
              <div key={section.title}>
                <div className="flex items-center space-x-3 mb-4">
                  <section.icon className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Sign Out */}
            <div className="pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={signOut}
                className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;