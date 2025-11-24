import React, { useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { TaskCommentViewModel } from '@/types/task';
import { taskService } from '@/services/taskService';
import { useToast } from '@/contexts/ToastContext';

interface TaskCommentFormProps {
  taskId: number;
  onCommentAdded: (comment: TaskCommentViewModel) => void;
}

const TaskCommentForm = React.memo(({
  taskId,
  onCommentAdded
}: TaskCommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const comment = await taskService.addComment({
        taskId,
        content: content.trim()
      });

      setContent('');
      onCommentAdded(comment);
      showSuccess('Comment Added', 'Your comment has been posted');
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  }, [taskId, content, onCommentAdded, showSuccess, showError]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (content.trim()) {
        handleSubmit();
      }
    }
  }, [content, handleSubmit]);

  return (
    <div className="border rounded">
      <div className="comment-area-box">
        <textarea 
          rows={3} 
          className="form-control border-0 resize-none" 
          placeholder="Add a comment... (Ctrl+Enter to submit)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />
        <div className="p-2 bg-light d-flex justify-content-between align-items-center">
          <div className="text-muted font-12">
            {content.length > 0 && `${content.length} characters`}
          </div>
          <Button 
            onClick={handleSubmit}
            size="sm" 
            variant="success"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Submitting...
              </>
            ) : (
              <>
                <Icon icon="mdi:send" width={16} className="me-1" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

TaskCommentForm.displayName = 'TaskCommentForm';

export default TaskCommentForm;
