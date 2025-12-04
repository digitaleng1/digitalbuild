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
  ProjectTaskStatusViewModel,
  TaskAttachmentViewModel,
  CreateTaskStatusRequest,
  UpdateTaskStatus,
  ReorderTaskStatusItem,
} from '@/types/task';

const BASE_URL = '/api/tasks';

export const taskService = {
  async createTask(
    data: CreateTaskViewModel,
    attachments?: File[]
  ): Promise<TaskViewModel> {
    console.log('taskService.createTask called with:', { data, attachments });
    
    const formData = new FormData();
    
    // Add task fields
    formData.append('title', data.title);
    formData.append('projectId', data.projectId.toString());
    formData.append('statusId', data.statusId.toString());
    formData.append('priority', data.priority.toString());
    formData.append('isMilestone', data.isMilestone.toString());
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.deadline) {
      // Convert string to Date if needed, then to ISO string
      const deadlineDate = typeof data.deadline === 'string' 
        ? new Date(data.deadline) 
        : data.deadline;
      formData.append('deadline', deadlineDate.toISOString());
    }
    
    if (data.assignedToUserId) {
      formData.append('assignedToUserId', data.assignedToUserId);
    }
    
    if (data.parentTaskId) {
      formData.append('parentTaskId', data.parentTaskId.toString());
    }
    
    // Serialize labelIds as JSON string
    if (data.labelIds && data.labelIds.length > 0) {
      formData.append('labelIdsJson', JSON.stringify(data.labelIds));
    }
    
    // Add attachments
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    
    console.log('FormData prepared, sending request to:', BASE_URL);
    
    try {
      const result = await httpClient.post<TaskViewModel>(
        BASE_URL, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Request successful, result:', result);
      return result as TaskViewModel;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
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

  async updateTaskStatus(id: number, statusId: number): Promise<TaskViewModel> {
    return await httpClient.patch<TaskViewModel>(`${BASE_URL}/${id}/status`, { statusId }) as TaskViewModel;
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

  async getCommentsByTaskId(taskId: number): Promise<TaskCommentViewModel[]> {
    return (await httpClient.get<TaskCommentViewModel[]>(`${BASE_URL}/${taskId}/comments`) || []) as TaskCommentViewModel[];
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

  async getStatusesByProject(projectId: number): Promise<ProjectTaskStatusViewModel[]> {
    return (await httpClient.get<ProjectTaskStatusViewModel[]>(`${BASE_URL}/statuses/project/${projectId}`) || []) as ProjectTaskStatusViewModel[];
  },

  async createStatus(data: CreateTaskStatusRequest): Promise<ProjectTaskStatusViewModel> {
    return await httpClient.post<ProjectTaskStatusViewModel>(`${BASE_URL}/statuses`, data) as ProjectTaskStatusViewModel;
  },

  async updateStatus(statusId: number, data: UpdateTaskStatus): Promise<ProjectTaskStatusViewModel> {
    return await httpClient.put<ProjectTaskStatusViewModel>(`${BASE_URL}/statuses/${statusId}`, data) as ProjectTaskStatusViewModel;
  },

  async deleteStatus(statusId: number): Promise<void> {
    await httpClient.delete(`${BASE_URL}/statuses/${statusId}`);
  },

  async reorderStatuses(projectId: number, statuses: ReorderTaskStatusItem[]): Promise<void> {
    await httpClient.post(`${BASE_URL}/statuses/reorder?projectId=${projectId}`, { statuses });
  },

  async getAuditLogs(taskId: number): Promise<TaskAuditLogViewModel[]> {
    return (await httpClient.get<TaskAuditLogViewModel[]>(`${BASE_URL}/${taskId}/audit-logs`) || []) as TaskAuditLogViewModel[];
  },

  /**
   * Get task files (attachments)
   */
  async getTaskFiles(taskId: number): Promise<TaskAttachmentViewModel[]> {
    const data = await httpClient.get(`/api/tasks/${taskId}/files`);
    return data as TaskAttachmentViewModel[];
  },

  /**
   * Upload files to task
   */
  async uploadTaskFiles(taskId: number, files: File[]): Promise<TaskAttachmentViewModel[]> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    const result = await httpClient.post(`/api/tasks/${taskId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result as TaskAttachmentViewModel[];
  },

  /**
   * Delete task file
   */
  async deleteTaskFile(fileId: number): Promise<void> {
    await httpClient.delete(`/api/tasks/files/${fileId}`);
  },
};
