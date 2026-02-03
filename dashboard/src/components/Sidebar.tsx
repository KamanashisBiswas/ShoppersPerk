'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MdDashboard, 
  MdShoppingBag, 
  MdPeople, 
  MdSettings, 
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const links = [
    { name: 'Overview', href: '/dashboard', icon: MdDashboard },
    { name: 'Products', href: '/dashboard/products', icon: MdShoppingBag },
    { name: 'Customers', href: '/dashboard/customers', icon: MdPeople },
    { name: 'Settings', href: '/dashboard/settings', icon: MdSettings },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-lg text-white"
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
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200">
            <MdLogout size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
