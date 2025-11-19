import { httpClient } from '@/common/api/interceptors';
import type {
  TaskViewModel,
  TaskDetailViewModel,
  CreateTaskViewModel,
  UpdateTaskViewModel,
  CreateTaskCommentViewModel,
  UpdateTaskCommentViewModel,
  TaskCommentViewModel,
  CreateTaskLabelViewModel,
  TaskLabelViewModel,
  TaskAuditLogViewModel,
} from '@/types/task';

const BASE_URL = '/api/tasks';

export const taskService = {
  async createTask(data: CreateTaskViewModel): Promise<TaskViewModel> {
    return await httpClient.post<TaskViewModel>(BASE_URL, data) as TaskViewModel;
  },

  async getTaskById(id: number): Promise<TaskDetailViewModel> {
    return await httpClient.get<TaskDetailViewModel>(`${BASE_URL}/${id}`) as TaskDetailViewModel;
  },

  async getTasksByProject(projectId: number): Promise<TaskViewModel[]> {
    return (await httpClient.get<TaskViewModel[]>(`${BASE_URL}/project/${projectId}`) || []) as TaskViewModel[];
  },

  async getTasksForSelection(projectId: number): Promise<Array<{ id: number; title: string }>> {
    const tasks = (await httpClient.get<TaskViewModel[]>(`${BASE_URL}/project/${projectId}`) || []) as TaskViewModel[];
    return tasks.map(task => ({ id: task.id, title: task.title }));
  },

  async getMyAssignedTasks(): Promise<TaskViewModel[]> {
    return (await httpClient.get<TaskViewModel[]>(`${BASE_URL}/assigned`) || []) as TaskViewModel[];
  },

  async updateTask(id: number, data: UpdateTaskViewModel): Promise<TaskViewModel> {
    return await httpClient.put<TaskViewModel>(`${BASE_URL}/${id}`, data) as TaskViewModel;
  },

  async deleteTask(id: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`);
  },

  async addComment(data: CreateTaskCommentViewModel): Promise<TaskCommentViewModel> {
    return await httpClient.post<TaskCommentViewModel>(`${BASE_URL}/comments`, data) as TaskCommentViewModel;
  },

  async updateComment(commentId: number, data: UpdateTaskCommentViewModel): Promise<TaskCommentViewModel> {
    return await httpClient.put<TaskCommentViewModel>(`${BASE_URL}/comments/${commentId}`, data) as TaskCommentViewModel;
  },

  async deleteComment(commentId: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/comments/${commentId}`);
  },

  async addWatcher(taskId: number): Promise<void> {
    await httpClient.post(`${BASE_URL}/${taskId}/watchers`);
  },

  async removeWatcher(taskId: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${taskId}/watchers`);
  },

  async createLabel(data: CreateTaskLabelViewModel): Promise<TaskLabelViewModel> {
    return await httpClient.post<TaskLabelViewModel>(`${BASE_URL}/labels`, data) as TaskLabelViewModel;
  },

  async getLabelsByProject(projectId?: number): Promise<TaskLabelViewModel[]> {
    const url = projectId 
      ? `${BASE_URL}/labels/project/${projectId}` 
      : `${BASE_URL}/labels/project/null`;
    return (await httpClient.get<TaskLabelViewModel[]>(url) || []) as TaskLabelViewModel[];
  },

  async deleteLabel(labelId: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/labels/${labelId}`);
  },

  async getAuditLogs(taskId: number): Promise<TaskAuditLogViewModel[]> {
    return (await httpClient.get<TaskAuditLogViewModel[]>(`${BASE_URL}/${taskId}/audit-logs`) || []) as TaskAuditLogViewModel[];
  },
};
