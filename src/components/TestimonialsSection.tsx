'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "FocusFlow's live stopwatch bar changed how our dev team logs sprint hours. We reclaimed at least 5 hours per developer every week.",
      author: "Alex Morgan",
      role: "Lead Engineering Manager",
      company: "Veloce Tech",
      avatar: "AM",
    },
    {
      quote: "The subtask progress visualizer is brilliantly clear. Clients love seeing real-time completion percentages instead of manual status updates.",
      author: "Sarah Jenkins",
      role: "Principal Product Designer",
      company: "Studio Craft",
      avatar: "SJ",
    },
    {
      quote: "No bloated menus, just active state tracking, clear task priorities, and precise time logging. Exactly what a modern SaaS should be.",
      author: "David Chen",
      role: "Founder & CTO",
      company: "SyncLabs",
      avatar: "DC",
    },
  ];

  return (
    <section className="bg-slate-50 py-20 transition-colors duration-200 dark:bg-slate-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Trusted By High Output Teams
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Loved by project leads and creators
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-300">
                "{t.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.author}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role} · <span className="text-slate-700 dark:text-slate-300">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}