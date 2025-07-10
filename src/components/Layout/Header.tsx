import React, { useState } from 'react';
import { Search, MessageCircle, Bell, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/80 border-gray-800/30 text-gray-100'
  };

  const inputClasses = {
    light: 'bg-gray-100 text-gray-900 placeholder-gray-500',
    dark: 'bg-gray-700 text-white placeholder-gray-400',
    gray: 'bg-gray-300 text-gray-900 placeholder-gray-600',
    chroma: 'bg-gray-800/40 text-gray-100 placeholder-gray-400 border-gray-700/30'
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${themeClasses[theme]} border-b backdrop-blur-md bg-opacity-90`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              SocialChat
            </motion.h1>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClasses[theme]} pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-opacity-80 bg-purple-500 text-white relative"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-opacity-80 bg-purple-500 text-white relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            <div className="flex items-center space-x-2">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'gray' | 'chroma')}
                className={`${inputClasses[theme]} px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="gray">Gray</option>
                <option value="chroma">Chroma</option>
              </select>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-opacity-80"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute right-0 mt-2 w-48 ${themeClasses[theme]} rounded-lg shadow-lg border py-2`}
                >
                  <button className="w-full px-4 py-2 text-left hover:bg-opacity-80 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-opacity-80 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={signOut}
                    className="w-full px-4 py-2 text-left hover:bg-opacity-80 text-red-500"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;