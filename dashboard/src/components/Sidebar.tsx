'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MdDashboard, 
  MdShoppingBag, 
  MdPeople, 
  MdSettings, 
  MdLogout,
  MdMenu,
  MdClose,
  MdViewCarousel
} from 'react-icons/md';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const [userRole, setUserRole] = useState<string | null>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {
        console.error('Failed to parse user');
      }
    }
  }, []);

  const links = [
    { name: 'Overview', href: '/dashboard', icon: MdDashboard },
    ...(userRole === 'admin' ? [
      { name: 'Users', href: '/dashboard/users', icon: MdPeople },
      { name: 'Carousel', href: '/dashboard/carousel', icon: MdViewCarousel }
    ] : []),
  ];

  const handleSignOut = () => {
    // Clear cookies/localStorage if you use them here
    // For now, we'll force a reload/redirect which should trigger auth check
    // If you store token in localStorage:
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-lg text-white cursor-pointer"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      <aside 
        className={`fixed top-0 left-0 h-full bg-[#0a0a0a] border-r border-white/10 w-64 transition-transform duration-300 z-40 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ShoppersPerk
          </h2>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <div key={link.href} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarItem"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-xl shadow-[0_0_20px_0_rgba(168,85,247,0.1)]"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                <Link
                  href={link.href}
                  className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-purple-400" : ""} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-4">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
          >
            <MdLogout size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
