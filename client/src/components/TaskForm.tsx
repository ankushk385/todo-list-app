import { useState, type FormEvent, type ReactNode } from 'react';
import type { Priority, Task, TaskInput } from '../types/task';
import { toISODate } from '../utils/weeks';

interface TaskFormProps {
  // the task being edited, undefined when creating a new one
  initial?: Task;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (input: TaskInput) => void;
}

// same rules as the API, checked here first so the user gets instant
// feedback. the server checks everything again.
function validate(values: TaskInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.title.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length > 100) errors.title = 'Title is too long (100 characters max)';

  if (values.description.trim().length > 500) {
    errors.description = 'Description is too long (500 characters max)';
  }

  if (!values.date) errors.date = 'Date is required';
  if (!values.startTime) errors.startTime = 'Start time is required';

  if (values.endTime && values.startTime && values.endTime <= values.startTime) {
    errors.endTime = 'End time must be after the start time';
  }

  return errors;
}

function inputClass(error?: string) {
  return `w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary ${
    error ? 'border-danger' : 'border-slate-200'
  }`;
}

export function TaskForm({ initial, submitting, serverError, onSubmit }: TaskFormProps) {
  const [values, setValues] = useState<TaskInput>(
    initial ?? {
      title: '',
      description: '',
      date: toISODate(new Date()), // defaults to today
      startTime: '',
      endTime: '',
      priority: 'low',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-danger">{serverError}</p>
      )}

      <Field id="title" label="Task title" error={errors.title} required>
        <input
          id="title"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          maxLength={100}
          placeholder="Doing Homework"
          className={inputClass(errors.title)}
        />
      </Field>

      <Field id="date" label="Set date" error={errors.date} required>
        <input
          id="date"
          type="date"
          value={values.date}
          onChange={(e) => set('date', e.target.value)}
          className={inputClass(errors.date)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="start" label="Starts" error={errors.startTime} required>
          <input
            id="start"
            type="time"
            value={values.startTime}
            onChange={(e) => set('startTime', e.target.value)}
            className={inputClass(errors.startTime)}
          />
        </Field>
        <Field id="end" label="Ends" error={errors.endTime}>
          <input
            id="end"
            type="time"
            value={values.endTime}
            onChange={(e) => set('endTime', e.target.value)}
            className={inputClass(errors.endTime)}
          />
        </Field>
      </div>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          maxLength={500}
          placeholder="Add description"
          className={`${inputClass(errors.description)} resize-none`}
        />
      </Field>

      <Field id="priority" label="Priority">
        <div className="flex gap-2" id="priority">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => set('priority', p)}
              className={`flex-1 rounded-full py-2 text-sm font-medium capitalize ${
                values.priority === p ? 'bg-primary text-white' : 'bg-slate-100 text-muted'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {submitting ? 'Saving...' : initial ? 'Update task' : 'Create task'}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
