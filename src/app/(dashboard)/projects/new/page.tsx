'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getAuthData } from '@/utils/auth';
import { BASE_URL } from '@/app/(auth)/login/page';

export type ProjectType = 'PERSONAL' | 'WORK';


export default function NewProjectPage() {
  const router = useRouter();

  // --- Form State ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('PERSONAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim()) {
      toast.error('Project name is required.');
      return;
    }

    const { token, isAuthenticated } = getAuthData();

    if (!isAuthenticated || !token) {
      toast.error('You must be logged in to create a project.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          type,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to create project.');
      }

      toast.success(resData.message || 'Project created successfully!');
      
      
        router.push('/dashboard/projects');
    
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred while creating the project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* --- Header & Back Navigation --- */}
        <div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors duration-150 mb-4"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Create New Project
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Define a new work or personal area to organize tasks and log focus hours.
          </p>
        </div>

        {/* --- Form Container Card --- */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Project Name Field */}
            <div>
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                required
                placeholder="e.g. FocusFlow Web App, Personal Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900"
              />
            </div>

            {/* Project Type Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                Project Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Personal Option */}
                <button
                  type="button"
                  onClick={() => setType('PERSONAL')}
                  className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all duration-200 ${
                    type === 'PERSONAL'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500/80 dark:bg-indigo-950/30'
                      : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/50 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                        type === 'PERSONAL'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60'
                          : 'bg-slate-200/60 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      PERSONAL
                    </span>
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        type === 'PERSONAL'
                          ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {type === 'PERSONAL' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Side projects, learning goals, and personal habit tracking.
                  </p>
                </button>

                {/* Work Option */}
                <button
                  type="button"
                  onClick={() => setType('WORK')}
                  className={`flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all duration-200 ${
                    type === 'WORK'
                      ? 'border-violet-500 bg-violet-50/50 dark:border-violet-500/80 dark:bg-violet-950/30'
                      : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/50 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                        type === 'WORK'
                          ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60'
                          : 'bg-slate-200/60 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      WORK
                    </span>
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        type === 'WORK'
                          ? 'border-violet-600 bg-violet-600 dark:border-violet-500 dark:bg-violet-500'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {type === 'WORK' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Professional tasks, client work, and team deliverables.
                  </p>
                </button>
              </div>
            </div>

            {/* Project Description Field */}
            <div>
              <label
                htmlFor="projectDescription"
                className="block text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                Description <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Optional)</span>
              </label>
              <textarea
                id="projectDescription"
                rows={4}
                placeholder="Briefly describe the key goals or scope of this project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <Link
                href="/dashboard/projects"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-700"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}