export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface ProjectTaskStatusViewModel {
  id: number;
  name: string;
  color?: string;
  order: number;
  isDefault: boolean;
  isCompleted: boolean;
  projectId?: number;
  createdAt: string;
}

export interface TaskLabelViewModel {
  id: number;
  name: string;
  color: string;
  projectId?: number;
  createdAt: string;
}

export interface TaskCommentViewModel {
  id: number;
  taskId: number;
  userId: string;
  userName: string;
  userProfilePictureUrl?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
}

export interface TaskAttachmentViewModel {
  id: number;
  taskId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedByUserId: string;
  uploadedByUserName: string;
  uploadedAt: string;
}

export interface TaskWatcherViewModel {
  id: number;
  taskId: number;
  userId: string;
  userName: string;
  userEmail?: string;
  userProfilePictureUrl?: string;
  createdAt: string;
}

export interface TaskAuditLogViewModel {
  id: number;
  taskId: number;
  userId: string;
  userName: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface TaskViewModel {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  startedAt?: string;
  completedAt?: string;
  isMilestone: boolean;
  createdAt: string;
  updatedAt: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  projectId: number;
  projectName: string;
  createdByUserId: string;
  createdByUserName: string;
  parentTaskId?: number;
  statusId: number;
  statusName: string;
  statusColor?: string;
  commentsCount: number;
  attachmentsCount: number;
  watchersCount: number;
  labels: string[];
}

export interface TaskDetailViewModel extends Omit<TaskViewModel, 'labels'> {
  assignedToUserEmail?: string;
  parentTaskTitle?: string;
  comments: TaskCommentViewModel[];
  attachments: TaskAttachmentViewModel[];
  watchers: TaskWatcherViewModel[];
  labels: TaskLabelViewModel[];
  childTasks: TaskViewModel[];
  auditLogs: TaskAuditLogViewModel[];
}

export interface CreateTaskViewModel {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  isMilestone: boolean;
  assignedToUserId?: string;
  projectId: number;
  parentTaskId?: number;
  statusId: number;
  labelIds: number[];
}

export interface UpdateTaskViewModel {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  isMilestone: boolean;
  assignedToUserId?: string;
  parentTaskId?: number;
  statusId: number;
  labelIds: number[];
}

export interface CreateTaskCommentViewModel {
  taskId: number;
  content: string;
}

export interface UpdateTaskCommentViewModel {
  content: string;
}

export interface CreateTaskLabelViewModel {
  name: string;
  color: string;
  projectId?: number;
}
