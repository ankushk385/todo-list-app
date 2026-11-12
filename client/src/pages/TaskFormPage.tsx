import { Link, useNavigate, useParams } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm';
import { ChevronLeftIcon } from '../components/icons';
import { useCreateTask, useTasks, useUpdateTask } from '../hooks/useTasks';
import type { TaskInput } from '../types/task';

// used for both creating (/tasks/new) and editing (/tasks/:id)
export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // the task list is already in the query cache, so we can just pick
  // the task from there instead of a second request
  const { data: tasks, isLoading } = useTasks();
  const task = isEdit ? tasks?.find((t) => t._id === id) : undefined;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const mutation = isEdit ? updateTask : createTask;

  function handleSubmit(input: TaskInput) {
    if (isEdit && id) {
      updateTask.mutate(
        { id, input },
        { onSuccess: () => navigate('/home') }
      );
    } else {
      createTask.mutate(input, { onSuccess: () => navigate('/home') });
    }
  }

  return (
    <div className="space-y-5 px-4 pt-6">
      <header className="flex items-center gap-3">
        <Link to="/home" aria-label="Back to home" className="rounded-full bg-white p-2 shadow-sm">
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-bold">{isEdit ? 'Edit Task' : 'Add New Task'}</h1>
      </header>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {isEdit && isLoading ? (
          <p className="text-sm text-muted">Loading task...</p>
        ) : isEdit && !task ? (
          <p className="text-sm text-muted">
            Task not found. It may have been deleted.
          </p>
        ) : (
          <TaskForm
            initial={task}
            submitting={mutation.isPending}
            serverError={mutation.error ? mutation.error.message : null}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
