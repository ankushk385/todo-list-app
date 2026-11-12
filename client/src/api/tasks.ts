import type { Task, TaskInput, TaskStatus } from '../types/task';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// small fetch wrapper - adds the base url, json headers and turns
// error responses into normal Error objects with the server message
async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api/tasks${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data as { message?: string } | null)?.message;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchTasks(search?: string): Promise<Task[]> {
  const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  return request(query);
}

export async function fetchTask(id: string): Promise<Task> {
  return request(`/${id}`);
}

export async function createTask(input: TaskInput): Promise<Task> {
  return request('', { method: 'POST', body: JSON.stringify(input) });
}

export async function updateTask(id: string, input: TaskInput): Promise<Task> {
  return request(`/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  return request(`/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function deleteTask(id: string): Promise<{ message: string }> {
  return request(`/${id}`, { method: 'DELETE' });
}
