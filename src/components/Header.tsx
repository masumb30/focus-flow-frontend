'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuthData, DecodedUser } from '@/utils/auth';
import { BASE_URL } from '@/app/(auth)/login/page';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync auth state on initial mount & window focus
  useEffect(() => {
    const checkAuth = () => {
      const { isAuthenticated, user: decodedUser } = getAuthData();
      setIsLoggedIn(isAuthenticated);
      setUser(decodedUser);
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('focus', checkAuth);

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute initials from user name (e.g. "John Doe" -> "JD")
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };


  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // Step 1: Send request to backend to clear the HTTP-Only cookie
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRITICAL: Passes current cookies to backend
      });

      if (!response.ok) {
        console.warn('Server cookie clearance failed, cleaning local storage regardless.');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Step 2: Clear client-side storage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('auth-change'));

      // Step 3: Redirect to login page and refresh Server Components
      router.push('/login');
      router.refresh();
      setIsLoading(false);
    }
  };
  // Sign out handler
  //   const handleSignOut = () => {
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //     setIsLoggedIn(false);
  //     setUser(null);
  //     setIsDropdownOpen(false);
  //     router.push('/login');
  //   };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left: Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 dark:bg-indigo-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Focus<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
        </Link>

        {/* Right: Actions / Auth State */}
        <div className="flex items-center gap-3 sm:gap-4">

          {isLoggedIn && user ? (
            /* Logged In: User Avatar & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-full p-0.5 text-slate-700 transition-all duration-200 hover:ring-2 hover:ring-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-slate-200 dark:focus:ring-offset-slate-900"
              >
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User Avatar'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if avatar URL breaks
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold">{getInitials(user.name)}</span>
                  )}

                  {/* Status Indicator Dot */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>

                <svg
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Avatar Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xl transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-900">

                  {/* User Profile Info */}
                  <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800/60">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user.name || 'User Account'}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <svg className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>

                    <Link
                      href="/projects"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <svg className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Projects
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <svg className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account Settings
                    </Link>
                  </div>

                  {/* Sign Out Divider */}
                  <div className="border-t border-slate-100 pt-1 dark:border-slate-800/60">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-all duration-150 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* Logged Out State: Sign In & Register Buttons */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}