import { addDays, getWeekStart, isToday, parseISODate, toISODate } from '../utils/weeks';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface WeekStripProps {
  weekStart: string;
  onSelectWeek: (weekStart: string) => void;
}

// the calendar strip from the design - shows the 7 days of one week
// and lets you move between weeks with the arrows
export function WeekStrip({ weekStart, onSelectWeek }: WeekStripProps) {
  const start = parseISODate(weekStart);
  const monthLabel = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isCurrentWeek = weekStart === toISODate(getWeekStart(new Date()));

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous week"
          onClick={() => onSelectWeek(toISODate(addDays(start, -7)))}
          className="rounded-full p-1.5 text-muted hover:bg-slate-50"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-semibold capitalize">{monthLabel}</h2>
        <button
          type="button"
          aria-label="Next week"
          onClick={() => onSelectWeek(toISODate(addDays(start, 7)))}
          className="rounded-full p-1.5 text-muted hover:bg-slate-50"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((day, i) => {
          const date = addDays(start, i);
          const today = isToday(date);
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[11px] text-muted">{day}</span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                  today ? 'bg-primary text-white' : ''
                }`}
              >
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {!isCurrentWeek && (
        <button
          type="button"
          onClick={() => onSelectWeek(toISODate(getWeekStart(new Date())))}
          className="mt-3 w-full text-center text-xs font-medium text-primary"
        >
          Back to this week
        </button>
      )}
    </section>
  );
}
