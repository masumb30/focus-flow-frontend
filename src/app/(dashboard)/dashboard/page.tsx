'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock summary data (you can replace this with real database/API queries)
const DASHBOARD_METRICS = {
  todos: {
    total: 15,
    completed: 9,
    pending: 6,
  },
  projects: {
    total: 8,
    active: 5,
    completed: 3,
    teamProjects: 4,
  },
  tasks: {
    total: 42,
    completed: 24,
    pending: 13,
    currentlyRunning: 5,
    unassignedInTeamProjects: 3,
  },
  timeSpent: {
    hoursThisMonth: 142.5,
    hoursToday: 5.2,
  },
};

// Mock list of quick-action Todos for the dashboard widget
const INITIAL_TODOS = [
  { id: '1', title: 'Review pull request for auth components', priority: 'High', completed: false, project: 'FocusFlow Core' },
  { id: '2', title: 'Prepare sprint backlog for team sync', priority: 'Medium', completed: false, project: 'Team Alpha' },
  { id: '3', title: 'Update Tailwind typography config', priority: 'Low', completed: true, project: 'Design System' },
  { id: '4', title: 'Fix dark mode contrast on sidebar icons', priority: 'High', completed: false, project: 'FocusFlow Core' },
];

export default function DashboardPage() {
  const [todos, setTodos] = useState(INITIAL_TODOS);

  // Toggle todo state locally
  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const { todos: todoStats, projects: projectStats, tasks: taskStats, timeSpent } = DASHBOARD_METRICS;

  return (
    <div className="space-y-8 pb-8">
      
      {/* 1. Header & Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Welcome back, Jane 👋
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Here is what’s happening across your projects and tasks today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/todos"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            View All Todos
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {/* 2. Top KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        
        {/* Total Tasks Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Tasks
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {taskStats.total}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {taskStats.completed} completed
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-400"
              style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Projects Overview Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Projects
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {projectStats.total}
            </span>
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
              {projectStats.active} active
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {projectStats.teamProjects} team projects • {projectStats.completed} completed
          </p>
        </div>

        {/* Todos Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Todos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {todoStats.pending}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Pending
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {todoStats.completed} completed out of {todoStats.total} total
          </p>
        </div>

        {/* Hours Logged Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Time Tracked
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {timeSpent.hoursThisMonth}h
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              +{timeSpent.hoursToday}h today
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Logged across all active projects
          </p>
        </div>

      </div>

      {/* 3. Detailed Metrics & Team Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column (2 Cols wide on desktop): Deep Breakdown Cards */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Task Status Breakdown Grid */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Task Workload Breakdown
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Current real-time distribution of your tasks.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              
              {/* Running Tasks */}
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Running</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {taskStats.currentlyRunning}
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">Active timers</p>
              </div>

              {/* Pending Tasks */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Pending</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {taskStats.pending}
                </p>
                <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">In queue</p>
              </div>

              {/* Completed Tasks */}
              <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-xs font-medium text-indigo-800 dark:text-indigo-300">Completed</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {taskStats.completed}
                </p>
                <p className="mt-0.5 text-[11px] text-indigo-700 dark:text-indigo-400">Finished</p>
              </div>

              {/* Total Tasks */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Total</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {taskStats.total}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">All tasks</p>
              </div>

            </div>
          </div>

          {/* Team Projects Attention Banner */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-orange-950/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Unassigned Team Tasks Action Needed
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    You have <span className="font-semibold text-amber-700 dark:text-amber-400">{taskStats.unassignedInTeamProjects} tasks</span> across <span className="font-semibold text-slate-800 dark:text-slate-200">{projectStats.teamProjects} team projects</span> that haven't been assigned to a team member yet.
                  </p>
                </div>
              </div>
              <Link
                href="/team-projects"
                className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
              >
                Assign Tasks
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column (1 Col wide on desktop): Currently Active & Todo Checklist Widget */}
        <div className="space-y-6">
          
          {/* Active Timer Focus Card */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Timer Active
              </span>
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                01:42:15
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Authentication Flow Redesign
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Project: FocusFlow Core
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Pause Timer
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Complete
              </button>
            </div>
          </div>

          {/* Quick Dashboard Todos Widget */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Priority Todos
              </h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {todos.filter((t) => t.completed).length}/{todos.length}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                    todo.completed
                      ? 'border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800/50 dark:bg-slate-950/20'
                      : 'border-slate-200/80 bg-white hover:border-indigo-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-indigo-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {}} // Controlled via parent div click
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-medium transition-all ${
                        todo.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {todo.title}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      {todo.project}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/todos"
              className="mt-4 block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Manage all todos →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}