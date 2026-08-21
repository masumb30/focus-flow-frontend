'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock credentials dataset for autofill feature
const MOCK_SIGNUP_USERS = [
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
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
  });

  const [autofilledUser, setAutofilledUser] = useState<string | null>(null);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Random Autofill Logic
  const handleAutofill = () => {
    const randomIndex = Math.floor(Math.random() * MOCK_SIGNUP_USERS.length);
    const selected = MOCK_SIGNUP_USERS[randomIndex];
    setFormData(selected);
    setAutofilledUser(selected.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup Submitted:', formData);
    // Add your signup API call logic here
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        
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
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Start tracking projects, subtasks, and sprint hours today.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-900 sm:p-8">
          
          {/* Autofill Demo Action Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAutofill}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50/80 px-4 py-2.5 text-xs font-semibold text-violet-700 transition-all duration-200 hover:bg-violet-100 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60 dark:focus:ring-offset-slate-900"
            >
              <svg className="h-4 w-4 text-violet-600 transition-transform group-hover:scale-110 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Autofill Demo Credentials</span>
            </button>
            {autofilledUser && (
              <p className="mt-1.5 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Filled credentials for {autofilledUser}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:ring-offset-slate-900"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@focusflow.io"
                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:ring-offset-slate-900"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:ring-offset-slate-900"
              />
            </div>

            {/* Avatar URL with Live Preview */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Avatar URL
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:ring-offset-slate-900"
                />
                
                {/* Image Preview Box */}
                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback if URL is invalid
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  ) : (
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
            >
              Create Account
            </button>
          </form>

          {/* Footer Navigation link */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              Sign in
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}