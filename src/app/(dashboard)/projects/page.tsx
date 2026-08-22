'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getAuthData } from '@/utils/auth';
import { BASE_URL } from '@/app/(auth)/login/page';

// --- Types matching Prisma Schema & API Response ---
export type ProjectType = 'PERSONAL' | 'WORK';

export interface Task {
  id: string;
  title: string;
  status: 'IDEAL' | 'IN_PROGRESS' | 'COMPLETED';
  totalTime: number; // in seconds or minutes
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  date: string;
  type: ProjectType;
  userId: string;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'ALL' | ProjectType>('ALL');

  // --- Fetch Projects ---
  const fetchProjects = async () => {
    setIsLoading(true);
    const { token, isAuthenticated } = getAuthData();

    if (!isAuthenticated || !token) {
      toast.error('You must be logged in to view your projects.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to fetch projects.');
      }

      setProjects(resData.data || []);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while fetching projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- Filtered Projects Computation ---
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'ALL' || project.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [projects, searchQuery, selectedType]);

  // --- Calculated Stats ---
  const stats = useMemo(() => {
    const total = projects.length;
    const personal = projects.filter((p) => p.type === 'PERSONAL').length;
    const work = projects.filter((p) => p.type === 'WORK').length;
    
    // Total time across all projects (in minutes)
    const totalMinutesLogged = projects.reduce((acc, proj) => {
      const projMinutes = proj.tasks?.reduce((tAcc, task) => tAcc + (task.totalTime || 0), 0) || 0;
      return acc + projMinutes;
    }, 0);

    const hours = Math.floor(totalMinutesLogged / 60);
    const mins = totalMinutesLogged % 60;

    return { total, personal, work, timeFormatted: `${hours}h ${mins}m` };
  }, [projects]);

  // Helper to format total time logged per project
  const formatProjectTime = (tasks?: Task[]) => {
    if (!tasks || tasks.length === 0) return '0m';
    const totalMins = tasks.reduce((acc, task) => acc + (task.totalTime || 0), 0);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  // Helper to compute task completion progress %
  const getProgress = (tasks?: Task[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
              Projects
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage your focus areas, track milestones, and monitor logged hours.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Project
          </Link>
        </div>

        {/* --- Quick Metrics Strip --- */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Projects</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Personal</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">{stats.personal}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Work</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-violet-600 dark:text-violet-400">{stats.work}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Time Tracked</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{stats.timeFormatted}</p>
          </div>
        </div>

        {/* --- Filters & Search Bar --- */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-0 bg-slate-100 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['ALL', 'PERSONAL', 'WORK'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  selectedType === type
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* --- Content Area --- */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="h-5 w-20 bg-slate-200 rounded dark:bg-slate-800" />
                  <div className="h-4 w-12 bg-slate-200 rounded dark:bg-slate-800" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-2 dark:bg-slate-800" />
                <div className="h-4 w-full bg-slate-100 rounded mb-4 dark:bg-slate-800/60" />
                <div className="h-2 w-full bg-slate-200 rounded mb-4 dark:bg-slate-800" />
                <div className="flex justify-between h-4 w-1/2 bg-slate-100 rounded dark:bg-slate-800/60" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {searchQuery || selectedType !== 'ALL' ? 'No matching projects' : 'No projects found'}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {searchQuery || selectedType !== 'ALL'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your first project to organize tasks and log focus time.'}
            </p>
            {!searchQuery && selectedType === 'ALL' && (
              <Link
                href="/projects/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Project
              </Link>
            )}
          </div>
        ) : (
          /* --- Projects Grid --- */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const progress = getProgress(project.tasks);
              const totalTasks = project.tasks?.length || 0;
              const completedTasks = project.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div>
                    {/* Header: Type Badge & Tracked Time */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                          project.type === 'WORK'
                            ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60'
                        }`}
                      >
                        {project.type}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                        <span className="font-mono tabular-nums">{formatProjectTime(project.tasks)}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                      {project.name}
                    </h2>
                    
                    <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Task Progress Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        {completedTasks}/{totalTasks} tasks completed
                      </span>
                      <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}