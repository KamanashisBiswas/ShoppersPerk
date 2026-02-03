'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { MdClose } from 'react-icons/md';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userStr || !token) {
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (e) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthorized === null) {
    return <LoadingScreen />;
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-4">
            <MdClose size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400 text-lg">
            This dashboard is strictly for administrators only. Your account does not have the required permissions.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors mt-4 cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <Sidebar />
      <main className="flex-1 w-full lg:ml-64 p-8 overflow-y-auto h-screen">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
