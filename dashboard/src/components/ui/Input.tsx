import React from 'react';
import { IconType } from 'react-icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconType;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && <label className="text-sm font-medium text-gray-300 ml-1 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Icon size={20} />
          </div>
        )}
        <input
          className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 ${Icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
