import React, { useState, useCallback, useEffect } from 'react';
import { Card, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { ReactSortable, ItemInterface } from 'react-sortablejs';
import type { TaskViewModel, ProjectTaskStatusViewModel } from '@/types/task';
import TaskListItem from './TaskListItem';

interface TaskListSectionProps {
  status: ProjectTaskStatusViewModel;
  tasks: TaskViewModel[];
  selectedTask: TaskViewModel | null;
  onSelectTask: (task: TaskViewModel) => void;
  onTaskMove?: (taskId: number, newStatusId: number) => void;
}

// Обертка для TaskViewModel с полем id для ReactSortable
interface SortableTask extends ItemInterface {
  id: number;
  taskData: TaskViewModel;
}

const TaskListSection = React.memo(({ 
  status, 
  tasks, 
  selectedTask, 
  onSelectTask,
  onTaskMove 
}: TaskListSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Преобразуем TaskViewModel в SortableTask
  const [sortableTasks, setSortableTasks] = useState<SortableTask[]>([]);

  // Синхронизируем sortableTasks с props tasks
  useEffect(() => {
    setSortableTasks(tasks.map(task => ({
      id: task.id,
      taskData: task
    })));
  }, [tasks]);

  // Обработчик перетаскивания между статусами
  const handleAdd = useCallback((evt: any) => {
    const taskId = parseInt(evt.item.getAttribute('data-task-id'), 10);
    
    if (taskId && onTaskMove) {
      console.log(`Task ${taskId} moved to status ${status.id}`);
      onTaskMove(taskId, status.id);
    }
  }, [status.id, onTaskMove]);

  return (
    <>
      <h5 className="m-0 pb-2">
        <Link 
          to="#" 
          className="text-dark" 
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
        >
          <i
            className={classNames(
              'uil',
              {
                'uil-angle-down': isOpen,
                'uil-angle-right': !isOpen,
              },
              'font-18'
            )}
          ></i>
          {status.name} <span className="text-muted">({tasks.length})</span>
        </Link>
      </h5>
      <Collapse in={isOpen}>
        <Card className="mb-0">
          <Card.Body className="pb-1 pt-2">
            <ReactSortable
              list={sortableTasks}
              setList={setSortableTasks}
              group="taskList"
              animation={200}
              delayOnTouchStart={true}
              delay={2}
              data-status-id={status.id}
              className="task-sortable-list"
              onAdd={handleAdd}
              style={{ minHeight: tasks.length === 0 ? '80px' : 'auto' }}
            >
              {tasks.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <i className="mdi mdi-clipboard-text-outline font-24 d-block mb-2"></i>
                  <span className="font-13">No tasks in this status</span>
                </div>
              ) : (
                sortableTasks.map(({ id, taskData }) => (
                  <div key={id} data-task-id={id} className="task-item-wrapper p-1">
                    <TaskListItem
                      task={taskData}
                      onSelect={onSelectTask}
                      isSelected={selectedTask?.id === id}
                    />
                  </div>
                ))
              )
            }</ReactSortable>
          </Card.Body>
        </Card>
      </Collapse>
    </>
  );
});

TaskListSection.displayName = 'TaskListSection';

export default TaskListSection;
