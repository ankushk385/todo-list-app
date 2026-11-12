import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  updateTaskStatus,
} from '../api/tasks';
import type { TaskInput, TaskStatus } from '../types/task';

// all tasks (the app is small, so we fetch everything once and
// group/filter it on the client)
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetchTasks(),
  });
}

// keyword search - only runs once there is something to search for
export function useSearchTasks(term: string) {
  return useQuery({
    queryKey: ['tasks', 'search', term],
    queryFn: () => fetchTasks(term),
    enabled: term.trim().length > 0,
  });
}

// every mutation just refreshes the ['tasks'] cache afterwards, which
// also covers the ['tasks', 'search', ...] queries since they start
// with the same key
function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['tasks'] });
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskInput }) => updateTask(id, input),
    onSuccess: invalidate,
  });
}

export function useUpdateStatus() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: invalidate,
  });
}
