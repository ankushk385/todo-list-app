import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskItem } from '../components/TaskItem';
import { ChevronLeftIcon, SearchIcon } from '../components/icons';
import { useDeleteTask, useSearchTasks, useUpdateStatus } from '../hooks/useTasks';

export default function SearchPage() {
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');

  // wait for the user to stop typing before hitting the API
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term), 300);
    return () => clearTimeout(timer);
  }, [term]);

  const { data: results, isLoading } = useSearchTasks(debounced);
  const updateStatus = useUpdateStatus();
  const removeTask = useDeleteTask();

  const hasTerm = debounced.trim().length > 0;

  return (
    <div className="space-y-4 px-4 pt-6">
      <header className="flex items-center gap-3">
        <Link to="/home" aria-label="Back to home" className="rounded-full bg-white p-2 shadow-sm">
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for a task"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </header>

      {!hasTerm && (
        <p className="px-1 text-sm text-muted">
          Type a keyword to search by task title or description.
        </p>
      )}

      {hasTerm && isLoading && <p className="px-1 text-sm text-muted">Searching...</p>}

      {hasTerm && !isLoading && (results ?? []).length === 0 && (
        <p className="px-1 text-sm text-muted">No tasks found for "{debounced}".</p>
      )}

      <ul className="space-y-2">
        {(results ?? []).map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
            onDelete={(id) => removeTask.mutate(id)}
          />
        ))}
      </ul>
    </div>
  );
}
