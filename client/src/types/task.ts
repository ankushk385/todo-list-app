export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'open' | 'in-progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM, can be empty
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// what the task form sends to the API
export interface TaskInput {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Priority;
}
