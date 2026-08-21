'use client';

export default function StatsSection() {
  const stats = [
    { label: 'Active Projects Managed', value: '120,000+' },
    { label: 'Tracked Hours Recorded', value: '4.8M hrs' },
    { label: 'Task Completion Rate', value: '94.2%' },
    { label: 'Average Time Saved / Week', value: '6.5 hrs' },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-white py-12 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}