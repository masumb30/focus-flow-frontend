'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      priceMonthly: '$12',
      priceAnnual: '$9',
      description: 'Ideal for freelancers & solo builders tracking active tasks.',
      features: ['Up to 5 Active Projects', 'Unlimited Time Stopwatch', 'Basic Subtask Lists', '7-Day History Logs'],
      highlighted: false,
      cta: 'Start Starter Plan',
    },
    {
      name: 'Pro Team',
      priceMonthly: '$29',
      priceAnnual: '$24',
      description: 'For growing teams managing multiple client deliverables.',
      features: ['Unlimited Active Projects', 'Shared Team Stopwatch', 'Advanced Subtask Dependencies', 'Priority Support & Export', 'Custom Work Categories'],
      highlighted: true,
      cta: 'Start 14-Day Free Trial',
    },
    {
      name: 'Enterprise',
      priceMonthly: '$79',
      priceAnnual: '$65',
      description: 'Dedicated workspace governance with custom SSO integration.',
      features: ['Custom Admin Controls', 'Dedicated Account Manager', 'Audit & Compliance Logs', 'SLA Guarantee', 'Custom API Rate Limits'],
      highlighted: false,
      cta: 'Contact Sales',
    },
  ];

  return (
    <section id="pricing" className="border-t border-slate-200/80 bg-white py-20 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-900 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Transparent Pricing
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Simple plans tailored to your team scale
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-indigo-500"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
              Annual <span className="ml-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 ${
                p.highlighted
                  ? 'border-indigo-600 bg-white shadow-xl dark:border-indigo-500 dark:bg-slate-950/80 ring-2 ring-indigo-600/20'
                  : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/30 dark:hover:border-slate-700'
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white dark:bg-indigo-500">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{p.name}</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{p.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {isAnnual ? p.priceAnnual : p.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-500">/ user / month</span>
                </div>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm dark:border-slate-800/60">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/register"
                className={`mt-8 w-full rounded-lg py-2.5 text-center text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  p.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-600'
                    : 'border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}