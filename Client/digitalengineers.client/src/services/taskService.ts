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
    const response = await httpClient.post<TaskViewModel>(BASE_URL, data);
    return response.data;
  },

  async getTaskById(id: number): Promise<TaskDetailViewModel> {
    const response = await httpClient.get<TaskDetailViewModel>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async getTasksByProject(projectId: number): Promise<TaskViewModel[]> {
    const response = await httpClient.get<TaskViewModel[]>(`${BASE_URL}/project/${projectId}`);
    return response.data;
  },

  async getMyAssignedTasks(): Promise<TaskViewModel[]> {
    const response = await httpClient.get<TaskViewModel[]>(`${BASE_URL}/assigned`);
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskViewModel): Promise<TaskViewModel> {
    const response = await httpClient.put<TaskViewModel>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`);
  },

  async addComment(data: CreateTaskCommentViewModel): Promise<TaskCommentViewModel> {
    const response = await httpClient.post<TaskCommentViewModel>(`${BASE_URL}/comments`, data);
    return response.data;
  },

  async updateComment(commentId: number, data: UpdateTaskCommentViewModel): Promise<TaskCommentViewModel> {
    const response = await httpClient.put<TaskCommentViewModel>(`${BASE_URL}/comments/${commentId}`, data);
    return response.data;
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
    const response = await httpClient.post<TaskLabelViewModel>(`${BASE_URL}/labels`, data);
    return response.data;
  },

  async getLabelsByProject(projectId?: number): Promise<TaskLabelViewModel[]> {
    const response = await httpClient.get<TaskLabelViewModel[]>(`${BASE_URL}/labels/project/${projectId ?? 'null'}`);
    return response.data;
  },

  async deleteLabel(labelId: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/labels/${labelId}`);
  },

  async getAuditLogs(taskId: number): Promise<TaskAuditLogViewModel[]> {
    const response = await httpClient.get<TaskAuditLogViewModel[]>(`${BASE_URL}/${taskId}/audit-logs`);
    return response.data;
  },
};
