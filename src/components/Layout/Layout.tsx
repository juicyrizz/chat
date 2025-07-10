import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  const backgroundClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900',
    gray: 'bg-gray-100',
    chroma: 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800'
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[theme]} transition-colors duration-300`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 ml-64 pt-16"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;