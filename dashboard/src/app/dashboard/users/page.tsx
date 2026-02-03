'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdFilterList, MdPerson, MdVisibility, MdClose, MdTrendingUp, MdPeople } from 'react-icons/md';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/utils/apiConfig';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  loginCount?: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data);
        toast.success('User list updated');
      } else {
        // Show specific error from backend (e.g., "Not authorized as an admin")
        toast.error(data.message || 'Failed to fetch users');
        
        // Optional: If unauthorized, redirect or update UI state
        if (response.status === 401 || response.status === 403) {
           // We could redirect here, but layout handles main protection.
           // This handles cases where layout passed (spoofed role) but backend failed.
        }
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">Users</h1>
          <p className="text-gray-400 mt-1">Manage and View Platform Users</p>
        </div>
        <Button 
            className='cursor-pointer shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300' 
            onClick={fetchUsers}
        >
            Refresh List
        </Button>
      </div>

      

      {/* Users Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Info</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Access Level</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-0">
                    <LoadingScreen fullScreen={false} />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-900/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-105"
                        title="View Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

const UserDetailsModal = ({ user, onClose }: { user: User; onClose: () => void }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl ring-1 ring-white/5"
      >
        {/* Hero Background */}
        <div className="h-40 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-blue-600/20 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
           <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-violet-600/30 blur-[80px] rounded-full mix-blend-screen" />
           <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[150%] bg-blue-600/30 blur-[80px] rounded-full mix-blend-screen" />
        </div>

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2.5 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md border border-white/5 hover:border-white/10"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="px-8 pb-10 relative">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-end -mt-12 mb-8 relative z-10 px-2">
             <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] border-[6px] border-[#0a0a0a] bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                   <span className="text-5xl font-bold text-white relative z-10 drop-shadow-lg">
                     {user.name.charAt(0).toUpperCase()}
                   </span>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-[#0a0a0a] rounded-full shadow-lg" title="Online" />
             </div>
             
             <div className="flex-1 pb-2">
               <h2 className="text-4xl font-bold text-white mb-1 tracking-tight">{user.name}</h2>
               <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-sm font-medium">{user.email}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-400 font-mono">
                    ID: {user._id.slice(-6)}
                  </span>
               </div>
             </div>


          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-colors">
               <div className="mb-3 p-3 rounded-full bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform duration-300">
                 <MdPerson size={24} />
               </div>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Role</p>
               <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                 user.role === 'admin' 
                   ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' 
                   : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
               }`}>
                 {user.role.toUpperCase()}
               </span>
             </div>

             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-colors">
               <div className="mb-3 p-3 rounded-full bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform duration-300">
                 <MdTrendingUp size={24} />
               </div>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Activity</p>
               <p className="text-xl font-bold text-white">{user.loginCount || 0} <span className="text-xs text-gray-600 font-normal">logins</span></p>
             </div>

             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-colors">
               <div className="mb-3 p-3 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                 <MdPeople size={24} />
               </div>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Joined</p>
               <p className="text-base font-bold text-white">
                 {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
               </p>
             </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Latest Session</h3>
                {user.lastLogin && (
                   <span className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                     Active Status
                   </span>
                )}
             </div>
             
             <div className="flex items-center gap-4">
                <div className="flex-1">
                   <p className="text-xs text-gray-500 mb-1">Last Login Time</p>
                   <p className="text-lg font-medium text-white font-mono">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) 
                        : 'No session data available'}
                   </p>
                </div>
             </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default UsersPage;
