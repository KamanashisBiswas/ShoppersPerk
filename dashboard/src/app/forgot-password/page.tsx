'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdEmail, MdContentCopy } from 'react-icons/md';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { API_BASE_URL } from '@/utils/apiConfig';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetToken(data.data);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (resetToken) {
      navigator.clipboard.writeText(resetToken);
      toast.success('Token copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-md p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-400">Enter your email to get a reset token</p>
          </div>

          {!resetToken ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                icon={MdEmail}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Get Reset Token'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-sm mb-2">Reset Token Generated:</p>
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg break-all">
                  <code className="text-sm font-mono text-white/80">{resetToken}</code>
                  <button onClick={copyToken} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white cursor-pointer">
                    <MdContentCopy />
                  </button>
                </div>
              </div>
              
              <Link href="/reset-password">
                <Button className="w-full mt-4">
                  Proceed to Verification
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
