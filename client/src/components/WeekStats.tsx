interface WeekStatsProps {
  completed: number;
  open: number;
}

// the two progress circles from the design, plus the weekly progress bar
export function WeekStats({ completed, open }: WeekStatsProps) {
  const total = completed + open;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-around">
        <StatCircle value={completed} total={total} color="#4366e8" label="Task Complete" />
        <StatCircle value={open} total={total} color="#0199fc" label="Task Pending" />
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs font-medium text-muted">
          <span>Weekly Progress</span>
          <span>{percent}%</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function StatCircle({
  value,
  total,
  color,
  label,
}: {
  value: number;
  total: number;
  color: string;
  label: string;
}) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = total ? value / total : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
          {value}
        </span>
      </div>
      <p className="text-xs font-semibold">{label}</p>
      <p className="-mt-1.5 text-[11px] text-muted">This Week</p>
    </div>
  );
}
