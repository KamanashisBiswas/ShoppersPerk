'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MdLock, MdVisibility, MdVisibilityOff, MdVpnKey } from 'react-icons/md';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Auto-fill token from URL if present (e.g. ?token=...)
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
        toast.error('Please enter the reset token');
        return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-gray-400">Enter your token and new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Reset Token"
            type="text"
            icon={MdVpnKey}
            placeholder="Paste your token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              icon={MdLock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              icon={MdLock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
      
      <Suspense fallback={<div>Loading...</div>}>
         <ResetPasswordContent />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
