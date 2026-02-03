import React from 'react';
import { IconType } from 'react-icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconType;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && <label className="text-sm text-gray-400 ml-1 mb-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Icon size={20} />
          </div>
        )}
        <input
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 backdrop-blur-sm ${Icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
