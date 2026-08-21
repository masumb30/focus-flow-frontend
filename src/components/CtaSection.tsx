'use client';

import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="bg-slate-50 py-20 transition-colors duration-200 dark:bg-slate-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-2xl bg-indigo-600 px-6 py-12 text-center text-white shadow-xl dark:bg-indigo-600/90 sm:px-12 sm:py-16">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to take control of your time & projects?
            </h2>
            <p className="mt-4 text-base text-indigo-100 sm:text-lg">
              Join thousands of engineering teams and freelancers shipping projects faster with FocusFlow.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Get Started for Free
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-indigo-400/60 bg-indigo-700/50 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Talk to Sales
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}