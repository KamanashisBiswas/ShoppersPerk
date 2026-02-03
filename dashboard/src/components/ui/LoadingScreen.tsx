import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  fullScreen = true, 
  message = 'Loading...' 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]";

  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated Spinner/Logo Container */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-purple-500/30 border-l-blue-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
             className="absolute inset-2 rounded-full border-4 border-t-blue-400 border-r-transparent border-b-blue-400/30 border-l-transparent"
             animate={{ rotate: -180 }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Loading Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 font-medium tracking-wide"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};
