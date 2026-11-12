import { useState } from 'react';
import type { TaskStatus } from '../types/task';
import { formatWeekRange, getWeekStart, toISODate, type WeekGroup } from '../utils/weeks';
import { TaskItem } from './TaskItem';
import { ChevronRightIcon } from './icons';

interface WeekCardProps {
  week: WeekGroup;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

// one week in the "all weeks" screen - shows the open/completed counts
// and expands to the tasks of that week when tapped
export function WeekCard({ week, onStatusChange, onDelete }: WeekCardProps) {
  const [open, setOpen] = useState(false);

  const isCurrentWeek = toISODate(week.start) === toISODate(getWeekStart(new Date()));

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold">
            {isCurrentWeek ? 'This Week' : formatWeekRange(week.start)}
          </p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {week.openCount} open
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {week.completedCount} completed
            </span>
          </div>
        </div>
        <ChevronRightIcon
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4">
          {week.tasks.length === 0 ? (
            <p className="text-center text-sm text-muted">No tasks in this week.</p>
          ) : (
            <ul className="space-y-2">
              {week.tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
