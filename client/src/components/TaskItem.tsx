import { useRef, useState, type TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus } from '../types/task';
import { formatDateShort, formatTime, parseISODate } from '../utils/weeks';
import { CheckIcon, TrashIcon } from './icons';
import { ConfirmDialog } from './ConfirmDialog';

// width of the delete button that sits behind the card
const DELETE_WIDTH = 88;

// tapping the status circle moves the task to the next state
const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  open: 'in-progress',
  'in-progress': 'completed',
  completed: 'open',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-600',
};

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function onTouchStart(e: TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchMove(e: TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    // ignore the gesture when the finger is really scrolling the page
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) setOffset(Math.max(-DELETE_WIDTH, dx));
    else setOffset(0);
  }

  function onTouchEnd() {
    touchStart.current = null;
    // snap open past half the button, closed otherwise
    setOffset((prev) => (prev < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
  }

  function askDelete() {
    setOffset(0);
    setConfirming(true);
  }

  const completed = task.status === 'completed';

  return (
    <li className="relative overflow-hidden rounded-2xl">
      {/* delete button behind the card, revealed by swiping left */}
      <button
        type="button"
        onClick={askDelete}
        aria-label="Delete task"
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-danger text-white"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      <div
        className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-transform"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* status circle: open -> in progress -> completed */}
        <button
          type="button"
          aria-label={`Mark as ${NEXT_STATUS[task.status]}`}
          onClick={() => onStatusChange(task._id, NEXT_STATUS[task.status])}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
            task.status === 'completed'
              ? 'border-primary bg-primary text-white'
              : task.status === 'in-progress'
                ? 'border-primary text-primary'
                : 'border-slate-300'
          }`}
        >
          {completed && <CheckIcon className="h-3.5 w-3.5" />}
        </button>

        {/* the task itself opens the edit screen */}
        <button
          type="button"
          onClick={() => navigate(`/tasks/${task._id}`)}
          className="min-w-0 flex-1 text-left"
        >
          <p className={`truncate text-sm font-semibold ${completed ? 'text-muted line-through' : ''}`}>
            {task.title}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {formatDateShort(parseISODate(task.date))} · {formatTime(task.startTime)}
            {task.endTime ? ` – ${formatTime(task.endTime)}` : ''}
          </p>
        </button>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>

        {/* delete icon for screens without touch - on phones you swipe */}
        <button
          type="button"
          onClick={askDelete}
          aria-label="Delete task"
          className="hidden shrink-0 text-muted hover:text-danger sm:block"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${task.title}" will be removed permanently.`}
          confirmLabel="Delete"
          onConfirm={() => onDelete(task._id)}
          onCancel={() => setConfirming(false)}
        />
      )}
    </li>
  );
}
