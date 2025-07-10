import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, MessageSquare, Camera, Bookmark, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const themeClasses = {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-gray-800 border-gray-700 text-white',
    gray: 'bg-gray-200 border-gray-300 text-gray-900',
    chroma: 'bg-gray-900/60 border-gray-800/30 text-gray-100 backdrop-blur-xl'
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: Users, label: 'Friends', path: '/friends', active: location.pathname === '/friends' },
    { icon: MessageSquare, label: 'Messages', path: '/chat', active: location.pathname === '/chat' },
    { icon: Camera, label: 'Stories', path: '/stories', active: location.pathname === '/stories' },
    { icon: Bookmark, label: 'Saved', path: '/saved', active: location.pathname === '/saved' },
    { icon: Settings, label: 'Settings', path: '/settings', active: location.pathname === '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Close mobile menu on navigation (if needed for mobile responsiveness)
  React.useEffect(() => {
    // This ensures the sidebar updates when location changes
  }, [location.pathname]);

  return (
    <motion.aside 
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-16 w-64 h-full ${themeClasses[theme]} border-r backdrop-blur-md bg-opacity-90 z-40`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'hover:bg-gray-100 hover:bg-opacity-80 cursor-pointer'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;