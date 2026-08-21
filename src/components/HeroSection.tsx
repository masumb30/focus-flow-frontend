'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 transition-colors duration-200 dark:bg-slate-950 sm:py-28 lg:py-32">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.2),rgba(2,6,23,0))]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Headline & CTA */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            
            {/* Feature Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-medium text-violet-700 transition-all duration-200 hover:border-violet-300 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
              <span className="flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400"></span>
              <span>FocusFlow 2.0 with Live Stopwatch Sync</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
              Focus on execution. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                Master your time.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              Streamline project workflows, track active stopwatches down to the second, and conquer subtask dependencies without the clutter. Built for modern high-output teams.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
              >
                Start Free Trial
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link
                href="#demo"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <svg className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch 2-Min Demo
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>14-day full access</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Mockup Widget Preview */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-900">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono text-slate-400">active_session.ts</span>
              </div>

              {/* Live Active Timer Task Card */}
              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
                    Mobile App Redesign
                  </span>
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>02:45:18</span>
                  </div>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Implement Dark Mode Color Tokens
                </h4>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>Subtasks</span>
                    <span className="font-mono">4 / 5 (80%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>

              {/* Status List Mock */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">API Gateway Auth Middleware</span>
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">Paused</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                  <span className="font-medium text-slate-400 line-through">User Onboarding Flow Tests</span>
                  <span className="font-mono text-slate-400">Completed</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}