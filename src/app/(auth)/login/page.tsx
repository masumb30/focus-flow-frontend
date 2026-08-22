'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

// Mock credentials dataset for login autofill
const MOCK_LOGIN_USERS = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.j@focusflow.io',
    password: 'Password123!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Alex Morgan',
    email: 'alex.m@focusflow.io',
    password: 'SecurePass456!',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@focusflow.io',
    password: 'DevMaster789!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.v@focusflow.io',
    password: 'CloudPro2026!',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.s@focusflow.io',
    password: 'CodeCraft101!',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    name: 'David Kim',
    email: 'david.k@focusflow.io',
    password: 'FullStack88!',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  },
  {
    name: 'Chloe Bennett',
    email: 'chloe.b@focusflow.io',
    password: 'Interface99!',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    name: 'Tariq Mansour',
    email: 'tariq.m@focusflow.io',
    password: 'DataSync321!',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    name: 'Nina Lindqvist',
    email: 'nina.l@focusflow.io',
    password: 'CyberShield55!',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
];

const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.API_URL : process.env.LOCALHOST_API_URL;

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [autofilledEmail, setAutofilledEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Random Autofill Logic
  const handleAutofill = () => {
    const randomIndex = Math.floor(Math.random() * MOCK_LOGIN_USERS.length);
    const selected = MOCK_LOGIN_USERS[randomIndex];
    setFormData(selected);
    setAutofilledEmail(selected.email);
  };

  // API Call Submission Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures HTTP-Only cookie is saved by browser
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('after login: ', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      // Store JWT token and user info for client-side access
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      window.dispatchEvent(new Event('auth-change'));

      toast.success(data.message || 'Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <ToastContainer/>
        {/* Header Block */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Focus<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Sign in to your workspace
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Welcome back! Select autofill or enter your account details.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-900 sm:p-8">
          
          {/* Autofill Demo Action Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAutofill}
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900/60 dark:focus:ring-offset-slate-900"
            >
              <svg className="h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Autofill Demo Credentials</span>
            </button>
            {autofilledEmail && (
              <p className="mt-1.5 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Filled credentials for {autofilledEmail}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@focusflow.io"
                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:ring-offset-slate-900"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:ring-offset-slate-900"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                type="checkbox"
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-offset-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}