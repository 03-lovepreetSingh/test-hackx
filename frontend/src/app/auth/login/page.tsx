'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '../../contexts/SessionContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: sessionLoading, error: sessionError } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setSuccess('Login successful! Redirecting...');
        
        // Redirect based on user role
        setTimeout(() => {
          router.push('/dashboard/profile');
        }, 1500);
      } else {
        setError(sessionError || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-[#131415] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0092ff] to-[#4ef467] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to HackX
            </h1>
            <p className="text-xl text-white/90">
              Join the ultimate hackathon platform and build amazing projects with developers worldwide.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚀</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Build & Innovate</h3>
                <p className="text-white/80">Create groundbreaking projects with cutting-edge technologies</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🤝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Collaborate</h3>
                <p className="text-white/80">Team up with talented developers from around the world</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏆</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Win Prizes</h3>
                <p className="text-white/80">Compete for amazing prizes and recognition</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-white/80 text-sm">
            © 2024 HackX. All rights reserved.
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome!
            </h2>
            <p className="text-gray-400">
              Hack X is a place to take part in a hackathon, create and manage one or to judge one. Become a part of HackX community
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field - Floating Label Style */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="peer w-full px-4 py-3 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent focus:bg-[#2a2a2e] transition-all"
                placeholder="Email address"
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 bg-[#131415] px-2 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#0092ff] peer-focus:bg-[#131415]"
              >
                Email address
              </label>
            </div>

            {/* Password Field - Floating Label Style */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="peer w-full px-4 py-3 pr-12 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0092ff] focus:border-transparent focus:bg-[#2a2a2e] transition-all"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-[#131415] px-2 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#0092ff] peer-focus:bg-[#131415]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#0092ff] focus:ring-[#0092ff] border-[#3a3a3e] rounded bg-[#2a2a2e]"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember for 30 days
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#0092ff] hover:text-[#0080e6] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                <span className="text-green-300 text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0092ff] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0080e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0092ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3a3a3e]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#131415] text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#3a3a3e] rounded-lg bg-[#2a2a2e] text-gray-300 hover:bg-[#3a3a3e] hover:text-white transition-colors font-medium">
                <Github className="h-5 w-5" />
              </button>
              <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#3a3a3e] rounded-lg bg-[#2a2a2e] text-gray-300 hover:bg-[#3a3a3e] hover:text-white transition-colors font-medium">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#3a3a3e] rounded-lg bg-[#2a2a2e] text-gray-300 hover:bg-[#3a3a3e] hover:text-white transition-colors font-medium">
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-[#0092ff] hover:text-[#0080e6]"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}