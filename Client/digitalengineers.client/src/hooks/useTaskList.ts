import { useState, useEffect, useMemo, useCallback } from 'react';
import { taskService } from '@/services/taskService';
import type { TaskViewModel, ProjectTaskStatusViewModel, TaskPriority } from '@/types/task';
import { groupTasksByStatus, type TasksByStatus } from '@/utils/taskHelpers';

export type SortOption = 'dueDate' | 'priority' | 'createdDate';

interface UseTaskListOptions {
  projectId: number;
}

export const useTaskList = ({ projectId }: UseTaskListOptions) => {
  const [tasks, setTasks] = useState<TaskViewModel[]>([]);
  const [statuses, setStatuses] = useState<ProjectTaskStatusViewModel[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
  const [filterAssignedToMe, setFilterAssignedToMe] = useState(false);
  const [filterHasDeadline, setFilterHasDeadline] = useState(false);
  const [filterMilestone, setFilterMilestone] = useState(false);

  const loadData = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [taskData, statusData] = await Promise.all([
        taskService.getTasksByProject(projectId),
        taskService.getStatusesByProject(projectId)
      ]);
      
      setTasks(taskData || []);
      setStatuses((statusData || []).sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load tasks');
      setTasks([]);
      setStatuses([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query)
      );
    }
    
    if (filterPriority !== null) {
      result = result.filter(task => task.priority === filterPriority);
    }
    
    if (filterAssignedToMe) {
      result = result.filter(task => task.assignedToUserId !== undefined);
    }
    
    if (filterHasDeadline) {
      result = result.filter(task => task.deadline !== undefined);
    }
    
    if (filterMilestone) {
      result = result.filter(task => task.isMilestone);
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        
        case 'priority':
          return b.priority - a.priority;
        
        case 'createdDate':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        
        default:
          return 0;
      }
    });
    
    return result;
  }, [tasks, searchQuery, sortBy, filterPriority, filterAssignedToMe, filterHasDeadline, filterMilestone]);

  const groupedTasks = useMemo(() => 
    groupTasksByStatus(filteredAndSortedTasks, statuses),
    [filteredAndSortedTasks, statuses]
  );

  const selectTask = useCallback((task: TaskViewModel | null) => {
    setSelectedTask(task);
  }, []);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    tasks: filteredAndSortedTasks,
    statuses,
    groupedTasks,
    selectedTask,
    selectTask,
    isLoading,
    error,
    refresh,
    
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterPriority,
    setFilterPriority,
    filterAssignedToMe,
    setFilterAssignedToMe,
    filterHasDeadline,
    setFilterHasDeadline,
    filterMilestone,
    setFilterMilestone,
  };
};
