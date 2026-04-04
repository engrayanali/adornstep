'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          await api.verifyToken();
          router.push('/admin/dashboard');
        } catch {
          localStorage.removeItem('admin_token');
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('[Login] Attempting login for user:', username);
      const response = await api.login(username, password);
      localStorage.setItem('admin_token', response.access_token);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('[Login] Login failed:', error);
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-taupe-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading text-charcoal-800 mb-2">Adorn Steps</h1>
          <p className="text-taupe-600 font-body">Administrative Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-heading text-charcoal-800 mb-2">Welcome Back</h2>
            <p className="text-sm text-taupe-600">Please sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-charcoal-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-taupe-300 rounded-lg focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all bg-cream-50 text-charcoal-800"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-taupe-300 rounded-lg focus:ring-2 focus:ring-blush-400 focus:border-blush-400 transition-all bg-cream-50 text-charcoal-800"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* FIX: inline style forces dark bg + white text, bypassing Tailwind conflicts */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#2c2c2c', color: '#ffffff', width: '100%', padding: '12px 16px', borderRadius: 8, fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontSize: 15 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-taupe-600 hover:text-blush-500 transition-colors inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}