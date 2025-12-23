import React, { memo } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { TaskViewModel } from '@/types/task';
import { getPriorityColor, getPriorityLabel, isOverdue } from '@/utils/taskHelpers';

interface TaskTreeNodeProps {
  task: TaskViewModel;
  level: number;
  hasChildren: boolean;
  childrenCount: number;
  isExpanded: boolean;
  isSelected: boolean;
  isDragging?: boolean;
  statusColor?: string;
  statusName?: string;
  onToggleExpand: () => void;
  onSelectTask: () => void;
}

const TaskTreeNode: React.FC<TaskTreeNodeProps> = ({
  task,
  level,
  hasChildren,
  childrenCount,
  isExpanded,
  isSelected,
  isDragging,
  statusColor,
  statusName,
  onToggleExpand,
  onSelectTask,
}) => {
  const priorityColor = getPriorityColor(task.priority);
  const priorityLabel = getPriorityLabel(task.priority);
  const taskOverdue = isOverdue(task.deadline);
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand();
  };

  const formatDeadline = () => {
    if (!task.deadline) return null;
    
    const date = new Date(task.deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (taskOverdue) {
      return (
        <span className="text-danger">
          <Icon icon="mdi:alert-circle-outline" width={16} className="me-1" />
          Overdue
        </span>
      );
    } else if (diffDays === 0) {
      return (
        <span className="text-warning">
          <Icon icon="mdi:clock-alert-outline" width={16} className="me-1" />
          Today
        </span>
      );
    } else if (diffDays === 1) {
      return (
        <span className="text-warning">
          <Icon icon="mdi:clock-outline" width={16} className="me-1" />
          Tomorrow
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="text-muted">
          <Icon icon="mdi:calendar-outline" width={16} className="me-1" />
          {diffDays}d
        </span>
      );
    }
    
    return (
      <span className="text-muted">
        <Icon icon="mdi:calendar-outline" width={16} className="me-1" />
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    );
  };

  return (
    <div
      className={`task-tree-node ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ paddingLeft: `${level * 24}px` }}
      onClick={onSelectTask}
    >
      <div className="task-tree-node-content">
        {/* Expand/Collapse button */}
        <div className="task-tree-node-expander">
          {hasChildren ? (
            <button
              className="btn btn-link p-0 text-muted"
              onClick={handleExpandClick}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Icon
                icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                width={20}
              />
            </button>
          ) : (
            <span style={{ width: '20px', display: 'inline-block' }} />
          )}
        </div>

        {/* Status badge */}
        {statusName && statusColor && (
          <Badge
            style={{
              backgroundColor: statusColor,
              color: '#fff',
              fontSize: '0.7rem'
            }}
            className="me-2"
          >
            {statusName}
          </Badge>
        )}

        {/* Priority badge */}
        <Badge bg={priorityColor} className="me-2" title={priorityLabel}>
          {priorityLabel[0]}
        </Badge>

        {/* Task title */}
        <div className="task-tree-node-title flex-grow-1">
          <span className={task.completedAt ? 'text-decoration-line-through text-muted' : ''}>
            {task.title}
          </span>
          
          {/* Milestone indicator */}
          {task.isMilestone && (
            <Icon
              icon="mdi:flag-variant"
              width={16}
              className="ms-2 text-primary"
              title="Milestone"
            />
          )}
        </div>

        {/* Task metadata */}
        <div className="task-tree-node-metadata">
          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="task-labels d-flex gap-1 me-2">
              {task.labels.slice(0, 3).map((label, idx) => (
                <Badge key={idx} bg="light" text="dark" className="small">
                  {label}
                </Badge>
              ))}
              {task.labels.length > 3 && (
                <Badge bg="light" text="dark" className="small">
                  +{task.labels.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Subtask count */}
          {hasChildren && (
            <span className="badge bg-secondary me-2" title="Subtasks">
              <Icon icon="mdi:format-list-checks" width={14} className="me-1" />
              {childrenCount}
            </span>
          )}

          {/* Comments count */}
          {task.commentsCount > 0 && (
            <span className="text-muted me-2" title="Comments">
              <Icon icon="mdi:comment-outline" width={16} className="me-1" />
              {task.commentsCount}
            </span>
          )}

          {/* Files count */}
          {task.filesCount > 0 && (
            <span className="text-muted me-2" title="Attachments">
              <Icon icon="mdi:paperclip" width={16} className="me-1" />
              {task.filesCount}
            </span>
          )}

          {/* Deadline */}
          {task.deadline && (
            <span className="me-2">
              {formatDeadline()}
            </span>
          )}

          {/* Assigned user */}
          {task.assignedToUserName && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  <div>
                    <strong>Assigned to:</strong><br />
                    {task.assignedToUserName}
                  </div>
                </Tooltip>
              }
            >
              <span className="task-assignee">
                {task.assignedToUserAvatar ? (
                  <img
                    src={task.assignedToUserAvatar}
                    alt={task.assignedToUserName}
                    className="assignee-avatar"
                  />
                ) : (
                  <Icon icon="mdi:account-circle" width={20} className="text-primary" />
                )}
              </span>
            </OverlayTrigger>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TaskTreeNode);
