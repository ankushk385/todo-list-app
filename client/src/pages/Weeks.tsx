import { Link } from 'react-router-dom';
import { WeekCard } from '../components/WeekCard';
import { ChevronLeftIcon } from '../components/icons';
import { useDeleteTask, useTasks, useUpdateStatus } from '../hooks/useTasks';
import { groupTasksByWeek, toISODate } from '../utils/weeks';

// every week that has tasks, as expandable cards with the open and
// completed counts - this is the weekly overview from the assessment
export default function Weeks() {
  const { data: tasks, isLoading } = useTasks();
  const updateStatus = useUpdateStatus();
  const removeTask = useDeleteTask();

  const weeks = groupTasksByWeek(tasks ?? []);

  return (
    <div className="space-y-4 px-4 pt-6">
      <header className="flex items-center gap-3">
        <Link
          to="/home"
          aria-label="Back to home"
          className="rounded-full bg-white p-2 shadow-sm"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-bold">All Weeks</h1>
      </header>

      <p className="px-1 text-xs text-muted">
        Tasks grouped by week, Monday to Sunday. Tap a week to see its tasks.
      </p>

      {isLoading && <p className="px-1 text-sm text-muted">Loading tasks...</p>}

      <div className="space-y-3">
        {weeks.map((week) => (
          <WeekCard
            key={toISODate(week.start)}
            week={week}
            onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
            onDelete={(id) => removeTask.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
}
