import React, { useState, useMemo, useCallback } from 'react';
import { Button, Spinner, Alert, InputGroup, FormControl, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { ProjectDto } from '@/types/project';
import TaskTreeNode from './TaskTreeNode';
import TaskModal from './TaskModal';
import TaskSidePanel from './TaskSidePanel';
import ProjectTaskStats from '@/components/project/ProjectTaskStats';
import { useTaskList } from '@/hooks/useTaskList';
import { buildTaskTree, filterTaskTree, countSubtasks, canMoveTask, type TaskTreeNode as TreeNode } from '@/utils/taskTreeHelpers';
import { taskService } from '@/services/taskService';
import { useToast } from '@/contexts/ToastContext';
import './TaskTree.css';

interface TaskTreeViewProps {
  projectId: number;
  project: ProjectDto;
  canEdit: boolean;
  onCreateTask?: () => void;
}

const TaskTreeView: React.FC<TaskTreeViewProps> = ({
  projectId,
  project,
  canEdit,
  onCreateTask,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { showSuccess, showError } = useToast();

  // Use task list hook internally
  const {
    statuses,
    tasks,
    selectedTask,
    selectTask,
    isLoading,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useTaskList({ projectId });
  
  // Build tree structure
  const treeNodes = useMemo(() => {
    const tree = buildTaskTree(tasks);
    return filterTaskTree(tree, searchQuery);
  }, [tasks, searchQuery]);

  // Toggle expand/collapse for a node
  const toggleExpand = useCallback((taskId: number) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  // Expand all nodes
  const expandAll = useCallback(() => {
    const allIds = new Set<number>();
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          allIds.add(node.task.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(treeNodes);
    setExpandedNodes(allIds);
  }, [treeNodes]);

  // Collapse all nodes
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  // Get status color for task
  const getStatusColor = useCallback((statusId: number): string | undefined => {
    return statuses.find(s => s.id === statusId)?.color;
  }, [statuses]);

  // Get status name for task
  const getStatusName = useCallback((statusId: number): string => {
    return statuses.find(s => s.id === statusId)?.name || '';
  }, [statuses]);

  // Handle drag end
  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!canEdit) return;
    
    const { draggableId, destination } = result;
    
    if (!destination) return;
    
    const taskId = Number(draggableId.replace('task-', ''));
    const newParentId = destination.droppableId === 'root' 
      ? null 
      : Number(destination.droppableId.replace('task-', ''));
    
    // Get current parent
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Skip if no change
    if (task.parentTaskId === newParentId) return;
    
    // Validate
    if (!canMoveTask(taskId, newParentId, tasks)) {
      showError('Invalid Move', 'Cannot move task to selected parent');
      return;
    }
    
    try {
      await taskService.updateTaskParent(taskId, newParentId);
      showSuccess('Task Moved', 'Task parent updated successfully');
      refresh();
    } catch (error: any) {
      showError('Move Failed', error.response?.data?.message || 'Failed to move task');
    }
  }, [canEdit, tasks, refresh, showSuccess, showError]);

  // Handle create task
  const handleAddNew = useCallback(() => {
    if (onCreateTask) {
      onCreateTask();
    } else {
      setIsCreateModalOpen(true);
    }
  }, [onCreateTask]);

  // Handle task update
  const handleTaskUpdate = useCallback(() => {
    refresh();
  }, [refresh]);

  // Handle create success
  const handleCreateSuccess = useCallback(() => {
    setIsCreateModalOpen(false);
    refresh();
  }, [refresh]);

  // Render tree recursively
  const renderTree = useCallback((nodes: TreeNode[]): React.ReactNode => {
    return nodes.map((node, index) => {
      const isExpanded = expandedNodes.has(node.task.id);
      const isSelected = selectedTask?.id === node.task.id;
      const childrenCount = countSubtasks(node.task.id, tasks);
      const hasChildren = node.children.length > 0;
      
      return (
        <React.Fragment key={node.task.id}>
          <Draggable
            draggableId={`task-${node.task.id}`}
            index={index}
            isDragDisabled={!canEdit}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {/* Droppable zone for this task - always present */}
                <Droppable
                  droppableId={`task-${node.task.id}`}
                  type="TASK"
                >
                  {(dropProvided, dropSnapshot) => (
                    <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                      <TaskTreeNode
                        task={node.task}
                        level={node.level}
                        hasChildren={hasChildren}
                        childrenCount={childrenCount}
                        isExpanded={isExpanded}
                        isSelected={isSelected}
                        isDragging={snapshot.isDragging}
                        statusColor={getStatusColor(node.task.statusId)}
                        statusName={getStatusName(node.task.statusId)}
                        onToggleExpand={() => toggleExpand(node.task.id)}
                        onSelectTask={() => selectTask(node.task)}
                      />
                      
                      {/* Children - only when expanded */}
                      {isExpanded && hasChildren && (
                        <div className={dropSnapshot.isDraggingOver ? 'task-tree-drop-zone' : ''}>
                          {renderTree(node.children)}
                        </div>
                      )}
                      
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </Draggable>
        </React.Fragment>
      );
    });
  }, [expandedNodes, selectedTask, tasks, canEdit, getStatusColor, getStatusName, toggleExpand, selectTask]);

  if (isLoading) {
    return (
      <div className="task-tree-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="task-tree-error">
        <Icon icon="mdi:alert-circle-outline" width={24} className="me-2" />
        {error}
      </Alert>
    );
  }

  const totalTasks = tasks.length;
  const visibleTasks = treeNodes.reduce((count, node) => {
    const countNode = (n: TreeNode): number => {
      return 1 + n.children.reduce((sum, child) => sum + countNode(child), 0);
    };
    return count + countNode(node);
  }, 0);

  return (
    <>
      <ProjectTaskStats projectId={projectId} project={project} />

      <Row>
        <Col xxl={selectedTask ? 8 : 12} xl={selectedTask ? 7 : 12}>
          <Card>
            <Card.Body className="p-0">
              <div className="task-tree-container">
                {/* Header with actions */}
                <div className="task-tree-header">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      <Icon icon="mdi:file-tree-outline" width={24} className="me-2" />
                      Task Tree
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                      <div className="task-tree-actions">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={expandAll}
                          title="Expand all"
                        >
                          <Icon icon="mdi:arrow-expand-vertical" width={16} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={collapseAll}
                          title="Collapse all"
                        >
                          <Icon icon="mdi:arrow-collapse-vertical" width={16} />
                        </Button>
                      </div>
                      {canEdit && (
                        <Button variant="success" size="sm" onClick={handleAddNew}>
                          <Icon icon="mdi:plus" width={18} className="me-1" />
                          Add New Task
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Search and Sort */}
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Dropdown>
                      <DropdownToggle
                        className="input-group-text btn btn-secondary"
                        type="button"
                      >
                        <Icon icon="mdi:sort-variant" width={18} />
                      </DropdownToggle>
                      <DropdownMenu align="end">
                        <DropdownItem
                          active={sortBy === 'dueDate'}
                          onClick={() => setSortBy('dueDate')}
                        >
                          <Icon icon="mdi:calendar-clock" width={16} className="me-2" />
                          Due Date
                        </DropdownItem>
                        <DropdownItem
                          active={sortBy === 'priority'}
                          onClick={() => setSortBy('priority')}
                        >
                          <Icon icon="mdi:flag" width={16} className="me-2" />
                          Priority
                        </DropdownItem>
                        <DropdownItem
                          active={sortBy === 'createdDate'}
                          onClick={() => setSortBy('createdDate')}
                        >
                          <Icon icon="mdi:clock-outline" width={16} className="me-2" />
                          Created Date
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </InputGroup>

                  {/* Stats */}
                  <div className="mt-2 text-muted small">
                    {searchQuery ? (
                      <>
                        Showing {visibleTasks} of {totalTasks} tasks matching "{searchQuery}"
                      </>
                    ) : (
                      <>
                        {totalTasks} total tasks
                      </>
                    )}
                  </div>
                </div>

                {/* Tree body with DnD */}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="root" type="TASK">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`task-tree-body ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                      >
                        {treeNodes.length === 0 ? (
                          <div className="task-tree-empty">
                            <Icon icon="mdi:file-tree-outline" width={64} className="d-block mx-auto mb-3 opacity-50" />
                            {searchQuery ? (
                              <p>No tasks found matching your search</p>
                            ) : (
                              <p>No tasks in this project yet</p>
                            )}
                          </div>
                        ) : (
                          <>
                            {/* Root drop zone - always visible at top */}
                            {canEdit && (
                              <div 
                                className={`task-tree-root-drop-zone ${snapshot.isDraggingOver ? 'active' : ''}`}
                                style={{ minHeight: '50px' }}
                              >
                                <div className="drop-zone-content">
                                  <Icon icon="mdi:arrow-down" width={18} className="me-2" />
                                  <span>Drop here to move to root level</span>
                                </div>
                              </div>
                            )}
                            
                            {renderTree(treeNodes)}
                          </>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {selectedTask && (
          <Col xxl={4} xl={5}>
            <TaskSidePanel
              taskId={selectedTask.id}
              projectId={projectId}
              statuses={statuses}
              onSuccess={handleTaskUpdate}
              onClose={() => selectTask(null)}
            />
          </Col>
        )}
      </Row>

      {canEdit && (
        <TaskModal
          show={isCreateModalOpen}
          onHide={() => setIsCreateModalOpen(false)}
          mode="create"
          projectId={projectId}
          statuses={statuses}
          onSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default React.memo(TaskTreeView);
