import React from 'react';
import { Row, Col, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import classNames from 'classnames';
import type { TaskViewModel } from '@/types/task';
import { getPriorityLabel, formatDueDate, isOverdue } from '@/utils/taskHelpers';

interface TaskListItemProps {
  task: TaskViewModel;
  onSelect: (task: TaskViewModel) => void;
  isSelected: boolean;
}

const TaskListItem = React.memo(({ task, onSelect, isSelected }: TaskListItemProps) => {
  const hasOverdueDeadline = task.deadline ? isOverdue(task.deadline) : false;

  const priorityClass = classNames('badge', {
    'badge-danger-lighten': task.priority === 3,
    'badge-warning-lighten': task.priority === 2,
    'badge-info-lighten': task.priority === 1,
    'badge-success-lighten': task.priority === 0,
  }, 'p-1');

  return (
    <Row className="justify-content-sm-between mt-2">
      <Col sm={6} className="mb-2 mb-sm-0">
        <div className="d-flex align-items-center gap-2">
          <div className="form-check mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id={`task-${task.id}`}
              checked={isSelected}
              onChange={() => onSelect(task)}
            />
            <label 
              className="form-check-label" 
              htmlFor={`task-${task.id}`}
              onClick={() => onSelect(task)}
              style={{ cursor: 'pointer' }}
            >
              {task.title}
              {task.isMilestone && (
                <i className="mdi mdi-flag text-warning ms-1"></i>
              )}
            </label>
          </div>
          
          {task.labels.length > 0 && (
            <div className="d-flex gap-1 flex-wrap">
              {task.labels.slice(0, 3).map((label, idx) => (
                <Badge 
                  key={idx} 
                  bg="light" 
                  text="dark" 
                  className="small"
                  style={{ fontSize: '0.7rem' }}
                >
                  {label}
                </Badge>
              ))}
              {task.labels.length > 3 && (
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="small"
                  style={{ fontSize: '0.7rem' }}
                >
                  +{task.labels.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Col>
      <Col sm={6}>
        <div className="d-flex justify-content-between">
          <div>
            {task.assignedToUserName && (
              <OverlayTrigger 
                placement="right" 
                overlay={<Tooltip>Assigned to {task.assignedToUserName}</Tooltip>}
              >
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedToUserName)}&background=727cf5&color=fff&size=32`}
                  alt=""
                  className="avatar-xs rounded-circle me-1"
                  id={`task-avatar-${task.id}`}
                />
              </OverlayTrigger>
            )}
          </div>
          <div>
            <ul className="list-inline font-13 text-end">
              {task.deadline && (
                <li className="list-inline-item">
                  <i className="uil uil-schedule font-16 me-1"></i>
                  {formatDueDate(task.deadline)}
                </li>
              )}
              {task.filesCount > 0 && (
                <li className="list-inline-item ms-1">
                  <i className="uil uil-paperclip font-16 me-1"></i>
                  {task.filesCount}
                </li>
              )}
              {task.commentsCount > 0 && (
                <li className="list-inline-item ms-1">
                  <i className="uil uil-comment-message font-16 me-1"></i>
                  {task.commentsCount}
                </li>
              )}
              <li className="list-inline-item ms-2">
                <span className={priorityClass}>
                  {getPriorityLabel(task.priority)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Col>
    </Row>
  );
});

TaskListItem.displayName = 'TaskListItem';

export default TaskListItem;
