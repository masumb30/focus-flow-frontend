'use client';

export default function WorkflowSection() {
  const steps = [
    {
      num: '01',
      title: 'Structure Projects & Subtasks',
      description: 'Group tasks by project, set assignees, and break down complex deliverables into crisp subtask checklists.',
    },
    {
      num: '02',
      title: 'Start Live Stopwatch Timers',
      description: 'Click start to begin logging precise work hours. Pause and resume seamlessly when context switching.',
    },
    {
      num: '03',
      title: 'Track Real-Time Progress',
      description: 'Watch automatic percentage progress bars calculate completion status based on completed subtasks.',
    },
  ];

  return (
    <section className="border-t border-slate-200/80 bg-white py-20 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-900 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Simple 3-Step Process
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Designed for seamless daily execution
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/50 dark:hover:border-slate-700"
            >
              <span className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {step.num}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}