import type { TaskViewModel } from '@/types/task';

/**
 * Tree node structure with task and its children
 */
export interface TaskTreeNode {
  task: TaskViewModel;
  children: TaskTreeNode[];
  level: number;
}

/**
 * Build hierarchical tree from flat task array
 * @param tasks - Flat array of tasks
 * @returns Array of root-level tree nodes
 */
export const buildTaskTree = (tasks: TaskViewModel[]): TaskTreeNode[] => {
  // Create a map for quick lookup
  const taskMap = new Map<number, TaskTreeNode>();
  
  // Initialize all nodes
  tasks.forEach(task => {
    taskMap.set(task.id, {
      task,
      children: [],
      level: 0
    });
  });
  
  const rootNodes: TaskTreeNode[] = [];
  
  // Build tree structure
  tasks.forEach(task => {
    const node = taskMap.get(task.id)!;
    
    if (task.parentTaskId && taskMap.has(task.parentTaskId)) {
      // Add to parent's children
      const parentNode = taskMap.get(task.parentTaskId)!;
      node.level = parentNode.level + 1;
      parentNode.children.push(node);
    } else {
      // Root level task
      rootNodes.push(node);
    }
  });
  
  // Sort children at each level by creation date (newest first)
  const sortChildren = (node: TaskTreeNode) => {
    node.children.sort((a, b) => 
      new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime()
    );
    node.children.forEach(sortChildren);
  };
  
  rootNodes.forEach(sortChildren);
  
  return rootNodes.sort((a, b) => 
    new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime()
  );
};

/**
 * Filter tree nodes by search query while preserving parent chain
 * @param nodes - Tree nodes to filter
 * @param searchQuery - Search string
 * @returns Filtered tree with matching nodes and their ancestors
 */
export const filterTaskTree = (
  nodes: TaskTreeNode[],
  searchQuery: string
): TaskTreeNode[] => {
  if (!searchQuery.trim()) {
    return nodes;
  }
  
  const query = searchQuery.toLowerCase();
  
  const filterNode = (node: TaskTreeNode): TaskTreeNode | null => {
    const matchesSearch = node.task.title.toLowerCase().includes(query) ||
                         node.task.description?.toLowerCase().includes(query);
    
    // Recursively filter children
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is TaskTreeNode => child !== null);
    
    // Include node if it matches or has matching children
    if (matchesSearch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren
      };
    }
    
    return null;
  };
  
  return nodes
    .map(filterNode)
    .filter((node): node is TaskTreeNode => node !== null);
};

/**
 * Count all subtasks recursively
 * @param taskId - Parent task ID
 * @param allTasks - All tasks in project
 * @returns Total count of subtasks
 */
export const countSubtasks = (taskId: number, allTasks: TaskViewModel[]): number => {
  const directChildren = allTasks.filter(t => t.parentTaskId === taskId);
  
  let count = directChildren.length;
  
  // Recursively count subtasks of children
  directChildren.forEach(child => {
    count += countSubtasks(child.id, allTasks);
  });
  
  return count;
};

/**
 * Get all descendant task IDs
 * @param taskId - Parent task ID
 * @param allTasks - All tasks in project
 * @returns Array of all descendant task IDs
 */
export const getDescendantIds = (taskId: number, allTasks: TaskViewModel[]): number[] => {
  const directChildren = allTasks.filter(t => t.parentTaskId === taskId);
  const ids: number[] = [];
  
  directChildren.forEach(child => {
    ids.push(child.id);
    ids.push(...getDescendantIds(child.id, allTasks));
  });
  
  return ids;
};

/**
 * Check if a task can be moved under another task (prevent circular reference)
 * @param taskId - Task to move
 * @param newParentId - Potential new parent
 * @param allTasks - All tasks in project
 * @returns true if move is valid
 */
export const canMoveTask = (
  taskId: number,
  newParentId: number | null,
  allTasks: TaskViewModel[]
): boolean => {
  if (!newParentId) return true; // Can always move to root level
  if (taskId === newParentId) return false; // Can't be own parent
  
  // Check if newParent is a descendant of task
  const descendantIds = getDescendantIds(taskId, allTasks);
  return !descendantIds.includes(newParentId);
};

/**
 * Flatten tree back to array
 * @param nodes - Tree nodes
 * @returns Flat array of tasks
 */
export const flattenTree = (nodes: TaskTreeNode[]): TaskViewModel[] => {
  const result: TaskViewModel[] = [];
  
  const traverse = (node: TaskTreeNode) => {
    result.push(node.task);
    node.children.forEach(traverse);
  };
  
  nodes.forEach(traverse);
  return result;
};

/**
 * Get maximum depth of tree
 * @param nodes - Tree nodes
 * @returns Maximum depth
 */
export const getMaxDepth = (nodes: TaskTreeNode[]): number => {
  if (nodes.length === 0) return 0;
  
  let maxDepth = 1;
  
  const traverse = (node: TaskTreeNode, currentDepth: number) => {
    maxDepth = Math.max(maxDepth, currentDepth);
    node.children.forEach(child => traverse(child, currentDepth + 1));
  };
  
  nodes.forEach(node => traverse(node, 1));
  return maxDepth;
};
