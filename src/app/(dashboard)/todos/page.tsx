'use client';

import { useState, useEffect, FormEvent } from 'react';
import { getAuthData } from '@/utils/auth';
import { BASE_URL } from '@/app/(auth)/login/page';

export interface Todo {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  date: string;
  userId: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mobile Tab State: 'pending' | 'completed'
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // 1. Fetch Todos Function
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    const { token, isAuthenticated } = getAuthData();

    if (!isAuthenticated || !token) {
      setError('You must be logged in to view your tasks.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch todos.');
      }

      const data: { data: Todo[] } = await response.json();
      console.log('Fetched Todos:', data);
      setTodos(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. Add Todo Handler
  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const { token, isAuthenticated } = getAuthData();

    if (!isAuthenticated || !token) {
      setError('Authentication token missing. Please log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo.');
      }

      const newTodo: {data:Todo} = await response.json();
      console.log('New Todo Created:', newTodo);
      setTodos((prev) => [newTodo.data, ...prev]);
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle Status Handler (PATCH Request)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const { token } = getAuthData();
    if (!token) return;

    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    // Optimistic UI Update
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, status: nextStatus } : todo))
    );

    try {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch {
      // Revert state on error
      fetchTodos();
    }
  };

  // Filtered Lists
  const pendingTodos = todos?.filter((t) => t.status === 'pending');
  const completedTodos = todos?.filter((t) => t.status === 'completed');

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 ">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Task Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Organize your daily tasks and keep track of completed goals.
          </p>
        </div>

        {/* Section 1: Add Todo Form */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            Add New Task
          </h2>
          <form onSubmit={handleAddTodo} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-slate-900"
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-xs font-medium text-rose-500 dark:text-rose-400">
              {error}
            </p>
          )}
        </section>

        {/* Section 2: Display Todos */}
        <section className="space-y-4">
          
          {/* Mobile Tabs Switcher (< md screens) */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 md:hidden">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 border-b-2 py-2.5 text-center text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Pending ({pendingTodos.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 border-b-2 py-2.5 text-center text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Completed ({completedTodos.length})
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex py-12 justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Desktop Dual Column Layout (>= md screens) */}
              <div className="hidden grid-cols-2 gap-6 md:grid">
                <TodoColumn
                  title="Pending Tasks"
                  count={pendingTodos.length}
                  todos={pendingTodos}
                  type="pending"
                  onToggle={handleToggleStatus}
                />
                <TodoColumn
                  title="Completed Tasks"
                  count={completedTodos.length}
                  todos={completedTodos}
                  type="completed"
                  onToggle={handleToggleStatus}
                />
              </div>

              {/* Mobile Single Column based on Active Tab */}
              <div className="md:hidden">
                {activeTab === 'pending' ? (
                  <TodoColumn
                    title="Pending Tasks"
                    count={pendingTodos.length}
                    todos={pendingTodos}
                    type="pending"
                    onToggle={handleToggleStatus}
                  />
                ) : (
                  <TodoColumn
                    title="Completed Tasks"
                    count={completedTodos.length}
                    todos={completedTodos}
                    type="completed"
                    onToggle={handleToggleStatus}
                  />
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

// Sub-component for rendering individual columns
interface TodoColumnProps {
  title: string;
  count: number;
  todos: Todo[];
  type: 'pending' | 'completed';
  onToggle: (id: string, currentStatus: string) => void;
}

function TodoColumn({ title, count, todos, type, onToggle }: TodoColumnProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 sm:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            type === 'pending'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
          }`}
        >
          {count}
        </span>
      </div>

      {todos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            No {type} tasks found.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:border-slate-200 dark:border-slate-800/60 dark:bg-slate-950/50 dark:hover:border-slate-700"
            >
              <input
                type="checkbox"
                checked={todo.status === 'completed'}
                onChange={() => onToggle(todo.id, todo.status)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-tight ${
                    todo.status === 'completed'
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {todo.title}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  {new Date(todo.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}