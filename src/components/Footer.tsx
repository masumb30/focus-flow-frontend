import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 text-slate-600 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Info & Status (Spans 2 columns on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white dark:bg-indigo-500">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                Focus<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              High-velocity project tracking, real-time stopwatch logs, and integrated subtask workflows designed for modern creators.
            </p>

            {/* Operational Status Token */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/20 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Time Tracker
                </Link>
              </li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Project Boards
                </Link>
              </li>
              <li>
                <Link href="/todo" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Task Management
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/docs" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Productivity Guides
                </Link>
              </li>
              <li>
                <Link href="/api" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  API & Webhooks
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 sm:flex-row dark:border-slate-800/80">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} FocusFlow Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}