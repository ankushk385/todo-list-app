import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { WeekStrip } from '../components/WeekStrip';
import { WeekStats } from '../components/WeekStats';
import { TaskItem } from '../components/TaskItem';
import { PlusIcon } from '../components/icons';
import { useDeleteTask, useTasks, useUpdateStatus } from '../hooks/useTasks';
import { useAppStore } from '../store/appStore';
import { formatDateLong, groupTasksByWeek, toISODate } from '../utils/weeks';

export default function Home() {
  const navigate = useNavigate();
  const { weekStart, setWeekStart } = useAppStore();
  const { data: tasks, isLoading, isError, refetch } = useTasks();
  const updateStatus = useUpdateStatus();
  const removeTask = useDeleteTask();

  const weeks = groupTasksByWeek(tasks ?? []);
  const week = weeks.find((w) => toISODate(w.start) === weekStart);
  const weekTasks = week?.tasks ?? [];
  const openCount = week?.openCount ?? 0;
  const completedCount = week?.completedCount ?? 0;

  return (
    <div className="space-y-4 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">My Tasks</h1>
          <p className="text-xs text-muted">{formatDateLong(new Date())}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/weeks')}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-primary shadow-sm"
        >
          All weeks
        </button>
      </header>

      <SearchBar />

      <WeekStrip weekStart={weekStart} onSelectWeek={setWeekStart} />

      <WeekStats completed={completedCount} open={openCount} />

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Tasks This Week</h2>
          <span className="text-xs text-muted">{weekTasks.length} tasks</span>
        </div>

        {isLoading && <p className="px-1 text-sm text-muted">Loading tasks...</p>}

        {isError && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-muted">Could not load tasks.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-medium text-primary"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && weekTasks.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-muted shadow-sm">
            No tasks this week yet. Tap the + button to add one.
          </p>
        )}

        <ul className="space-y-2">
          {weekTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
              onDelete={(id) => removeTask.mutate(id)}
            />
          ))}
        </ul>
      </section>

      {/* floating add button - on wide screens it stays inside the app column */}
      <button
        type="button"
        aria-label="Add task"
        onClick={() => navigate('/tasks/new')}
        className="fixed bottom-6 right-[max(1.5rem,calc(50%-13.5rem))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-dark"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
