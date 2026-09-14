'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

interface NavItem {
  name: string;
  href: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Team Projects',
    href: '/team-projects',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Todos',
    href: '/todos',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
    const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

const collapsed = isMobile || isCollapsed;

  return (
        
    <motion.aside
  initial={false}
  className={`sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between border-r border-slate-200/80 bg-white p-3 dark:border-slate-800/80 dark:bg-slate-900 md:p-4 overflow-hidden shrink-0 transition-[width] duration-250 ease-in-out ${
    isCollapsed ? 'w-[80px]' : 'w-[80px] md:w-[256px]'
  }`}
>
      {/* Upper Navigation Links */}
      <div className="space-y-6">
        {/* Header with Overview label and Toggle Button */}
        <div className="flex items-center justify-between px-3">
          <motion.span 
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className={`text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}
          >
            Overview
          </motion.span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className={`hidden md:block rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer ${isCollapsed ? 'mx-auto' : ''}`}
          >
            <svg 
              className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none gap-3 
                    
                ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                />
                
                {/* Text Label - Fades out nicely when collapsed */}
                <motion.span
  animate={{ opacity: collapsed ? 0 : 1 }}
  transition={{ duration: 0.15 }}
  className="whitespace-nowrap overflow-hidden hidden md:inline"
>
  {item.name}
</motion.span>

                {/* Active Indicator Dot */}
                {isActive && !isCollapsed && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Profile / Status Footer at the bottom */}
      <div className="border-t border-slate-200/80 pt-3 dark:border-slate-800/80">
        <div className={`flex items-center rounded-xl p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
          <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
            JD
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <motion.div 
            animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
            transition={{ duration: 0.15 }}
            className="min-w-0 flex-1 overflow-hidden"
          >
            <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">Jane Doe</p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">Pro Member</p>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );

    }