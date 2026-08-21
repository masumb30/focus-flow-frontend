'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getAuthData } from '@/utils/auth';

// --- Type Definitions matching Prisma Schema & API ---
export type ProjectType = 'PERSONAL' | 'WORK';
export type TaskStatus = 'IDEAL' | 'IN_PROGRESS' | 'COMPLETED';

export interface SubTask {
  id: string;
  title: string;
  date: string;
  status: TaskStatus;
  totalTime: number; // in minutes
  projectId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  date: string;
  status: TaskStatus;
  totalTime: number; // in minutes
  projectId: string;
  parentId: string | null;
  subTasks?: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  date: string;
  type: ProjectType;
  userId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');

  // --- Task Modal State ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [totalTime, setTotalTime] = useState<string>('0');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Fetch Project Data ---
  const fetchProjectDetails = async () => {
    if (!projectId) return;

    setIsLoading(true);
    const { token, isAuthenticated } = getAuthData();

    if (!isAuthenticated || !token) {
      toast.error('You must be logged in to view project details.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to fetch project details.');
      }

      setProject(resData.data);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while loading the project.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // --- Open Modal Handlers ---
  const handleOpenAddTaskModal = (parentId: string | null = null) => {
    setSelectedParentId(parentId);
    setTaskTitle('');
    setTotalTime('0');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setTaskTitle('');
    setTotalTime('0');
    setSelectedParentId(null);
  };

  // --- Add Task Handler ---
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      toast.error('Task title is required.');
      return;
    }

    const { token, isAuthenticated } = getAuthData();

    if (!isAuthenticated || !token) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          title: taskTitle.trim(),
          parentId: selectedParentId || null,
          totalTime: parseInt(totalTime, 10) || 0,
        }),
      });

      const resData = await response.json();

      if (!response.ok || (resData.success !== undefined && !resData.success)) {
        throw new Error(resData.message || 'Failed to create task.');
      }

      toast.success(
        selectedParentId ? 'Subtask added successfully!' : 'Task created successfully!'
      );
      handleCloseModal();
      
      // Refresh project tasks list
      fetchProjectDetails();
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred while adding the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helper to format total minutes into hours and minutes ---
  const formatTime = (minutes: number = 0) => {
    if (!minutes || minutes <= 0) return '0m';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  // --- Helper to format dates ---
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // --- Metrics Calculation ---
  const stats = useMemo(() => {
    if (!project || !project.tasks) {
      return { totalTasks: 0, completedTasks: 0, progress: 0, totalLoggedMinutes: 0 };
    }

    let totalTasks = 0;
    let completedTasks = 0;
    let totalLoggedMinutes = 0;

    project.tasks.forEach((task) => {
      totalTasks += 1;
      totalLoggedMinutes += task.totalTime || 0;
      if (task.status === 'COMPLETED') completedTasks += 1;

      if (task.subTasks && task.subTasks.length > 0) {
        task.subTasks.forEach((sub) => {
          totalTasks += 1;
          totalLoggedMinutes += sub.totalTime || 0;
          if (sub.status === 'COMPLETED') completedTasks += 1;
        });
      }
    });

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, progress, totalLoggedMinutes };
  }, [project]);

  // --- Filtered Tasks ---
  const filteredTasks = useMemo(() => {
    if (!project?.tasks) return [];
    if (statusFilter === 'ALL') return project.tasks;

    return project.tasks.filter((task) => task.status === statusFilter);
  }, [project, statusFilter]);

  // Helper to find parent task name for modal label
  const parentTaskName = useMemo(() => {
    if (!selectedParentId || !project?.tasks) return null;
    const parent = project.tasks.find((t) => t.id === selectedParentId);
    return parent ? parent.title : null;
  }, [selectedParentId, project]);

  // --- Render Status Badge ---
  const renderStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            Completed
          </span>
        );
      case 'IDEAL':
      default:
        return (
          <span className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-500/20 dark:text-amber-400">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* --- Top Navigation --- */}
        <div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors duration-150 mb-3"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* --- Loading State Skeleton --- */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
              <div className="h-6 w-24 bg-slate-200 rounded dark:bg-slate-800 mb-4" />
              <div className="h-8 w-2/3 bg-slate-200 rounded dark:bg-slate-800 mb-2" />
              <div className="h-4 w-1/2 bg-slate-100 rounded dark:bg-slate-800/60" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                  <div className="h-3 w-16 bg-slate-200 rounded dark:bg-slate-800 mb-2" />
                  <div className="h-6 w-12 bg-slate-200 rounded dark:bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        ) : !project ? (
          /* --- Not Found / Error State --- */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Project Not Found</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              The project you are looking for does not exist or you don't have access to it.
            </p>
            <Link
              href="/dashboard/projects"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Return to Projects
            </Link>
          </div>
        ) : (
          /* --- Main Content --- */
          <>
            {/* --- Project Header Card --- */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                        project.type === 'WORK'
                          ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60'
                      }`}
                    >
                      {project.type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Created on {formatDate(project.createdAt)}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                    {project.name}
                  </h1>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {project.description || 'No project description provided.'}
                  </p>
                </div>

                {/* Primary Add Task Button */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleOpenAddTaskModal(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Task
                  </button>
                </div>
              </div>
            </div>

            {/* --- Project Metrics Strip --- */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {stats.totalTasks}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {stats.completedTasks} <span className="text-xs font-normal text-slate-500">/ {stats.totalTasks}</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completion Rate</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                  {stats.progress}%
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Time Logged</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatTime(stats.totalLoggedMinutes)}
                </p>
              </div>
            </div>

            {/* --- Tasks Breakdown Section --- */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
              
              {/* Section Header & Status Filters */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Project Tasks</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tasks and nested subtasks assigned to this project.
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  {(['ALL', 'IDEAL', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        statusFilter === status
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {status === 'ALL'
                        ? 'All'
                        : status === 'IDEAL'
                        ? 'Pending'
                        : status === 'IN_PROGRESS'
                        ? 'In Progress'
                        : 'Completed'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                    No tasks match the filter
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {statusFilter !== 'ALL'
                      ? 'Try switching your filter to see other tasks.'
                      : 'Get started by creating a task for this project.'}
                  </p>
                  {statusFilter === 'ALL' && (
                    <button
                      onClick={() => handleOpenAddTaskModal(null)}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add First Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => {
                    const hasSubtasks = task.subTasks && task.subTasks.length > 0;

                    return (
                      <div
                        key={task.id}
                        className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/40 dark:hover:border-slate-700"
                      >
                        {/* Root Task Item */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                              {task.status === 'COMPLETED' && (
                                <svg className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-sm font-semibold ${
                                task.status === 'COMPLETED'
                                  ? 'text-slate-400 line-through dark:text-slate-500'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                              ⏱ {formatTime(task.totalTime)}
                            </span>
                            
                            {renderStatusBadge(task.status)}

                            {/* Add Subtask Trigger */}
                            <button
                              onClick={() => handleOpenAddTaskModal(task.id)}
                              title="Add subtask to this task"
                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                              <svg className="h-3 w-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Subtask
                            </button>
                          </div>
                        </div>

                        {/* Subtasks Hierarchy Tree */}
                        {hasSubtasks && (
                          <div className="mt-3 ml-4 space-y-2 border-l-2 border-indigo-200 pl-4 dark:border-indigo-900/50">
                            {task.subTasks!.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between py-1"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                                    {sub.status === 'COMPLETED' && (
                                      <svg className="h-3 w-3 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    )}
                                  </div>
                                  <span
                                    className={`text-xs ${
                                      sub.status === 'COMPLETED'
                                        ? 'text-slate-400 line-through dark:text-slate-500'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {sub.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5 ml-6 sm:ml-0">
                                  <span className="font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                                    {formatTime(sub.totalTime)}
                                  </span>
                                  {renderStatusBadge(sub.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </>
        )}

        {/* --- ADD TASK / SUBTASK MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedParentId ? 'Add Subtask' : 'Add New Task'}
                  </h3>
                  {parentTaskName && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[280px]">
                      Parent: {parentTaskName}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="modalTaskTitle" className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Task Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="modalTaskTitle"
                    type="text"
                    required
                    placeholder={selectedParentId ? "e.g. Implement API route" : "e.g. Setup project architecture"}
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                  />
                </div>

                {/* Initial Logged / Estimated Time */}
                <div>
                  <label htmlFor="modalTotalTime" className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Initial Tracked Time (in minutes)
                  </label>
                  <input
                    id="modalTotalTime"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={totalTime}
                    onChange={(e) => setTotalTime(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      selectedParentId ? 'Add Subtask' : 'Create Task'
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}