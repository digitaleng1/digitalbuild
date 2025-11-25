import type { TaskViewModel, ProjectTaskStatusViewModel } from '@/types/task';
import { TaskPriority } from '@/types/task';

export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.Low:
      return 'Low';
    case TaskPriority.Medium:
      return 'Medium';
    case TaskPriority.High:
      return 'High';
    case TaskPriority.Critical:
      return 'Critical';
    default:
      return 'Unknown';
  }
};

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.Low:
      return 'secondary';
    case TaskPriority.Medium:
      return 'info';
    case TaskPriority.High:
      return 'warning';
    case TaskPriority.Critical:
      return 'danger';
    default:
      return 'secondary';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (deadline?: string): boolean => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const formatDueDate = (deadline?: string): string => {
  if (!deadline) return '';

  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return formatDate(deadline);
  }
};

export interface TasksByStatus {
  [statusId: number]: TaskViewModel[];
}

export const groupTasksByStatus = (
  tasks: TaskViewModel[],
  statuses: ProjectTaskStatusViewModel[]
): TasksByStatus => {
  const grouped: TasksByStatus = {};

  statuses.forEach(status => {
    grouped[status.id] = [];
  });

  tasks.forEach(task => {
    if (grouped[task.statusId]) {
      grouped[task.statusId].push(task);
    }
  });

  return grouped;
};
