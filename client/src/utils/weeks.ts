import type { Task } from '../types/task';

// The assessment wants weeks to run Monday -> Sunday, so every helper
// here is built around "the Monday of a given date".

export function getWeekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayIndex = (d.getDay() + 6) % 7; // Mon = 0 ... Sun = 6
  d.setDate(d.getDate() - dayIndex);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// local date -> 'YYYY-MM-DD' (toISOString would shift the day because
// it works in UTC)
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 'YYYY-MM-DD' -> local date (new Date('YYYY-MM-DD') parses as UTC and
// can land on the wrong day depending on the timezone)
export function parseISODate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isToday(date: Date): boolean {
  return toISODate(date) === toISODate(new Date());
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}

// e.g. "10 – 16 Nov" or "28 Nov – 4 Dec"
export function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.toLocaleDateString('en-US', options)}`;
  }
  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
}

export interface WeekGroup {
  start: Date; // monday
  tasks: Task[];
  openCount: number;
  completedCount: number;
}

// groups tasks into weeks (monday -> sunday), newest week first.
// "open" means everything that isn't completed yet.
export function groupTasksByWeek(tasks: Task[]): WeekGroup[] {
  const byWeek = new Map<string, Task[]>();

  for (const task of tasks) {
    const key = toISODate(getWeekStart(parseISODate(task.date)));
    const bucket = byWeek.get(key);
    if (bucket) bucket.push(task);
    else byWeek.set(key, [task]);
  }

  // always include the current week, even when it has no tasks yet
  const currentKey = toISODate(getWeekStart(new Date()));
  if (!byWeek.has(currentKey)) byWeek.set(currentKey, []);

  const groups: WeekGroup[] = [...byWeek.entries()].map(([key, weekTasks]) => {
    weekTasks.sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    );
    const completedCount = weekTasks.filter((t) => t.status === 'completed').length;
    return {
      start: parseISODate(key),
      tasks: weekTasks,
      openCount: weekTasks.length - completedCount,
      completedCount,
    };
  });

  groups.sort((a, b) => b.start.getTime() - a.start.getTime());
  return groups;
}
