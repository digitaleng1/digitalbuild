import React, { useState, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import type { TaskCommentViewModel } from '@/types/task';
import TaskCommentItem from './TaskCommentItem';
import { taskService } from '@/services/taskService';
import { useToast } from '@/contexts/ToastContext';

interface TaskCommentListProps {
  taskId: number;
  comments: TaskCommentViewModel[];
  currentUserId: string;
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
}

const TaskCommentList = React.memo(({
  comments,
  currentUserId,
  onCommentUpdated,
  onCommentDeleted
}: TaskCommentListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const { showSuccess, showError } = useToast();

  const handleEdit = useCallback((commentId: number) => {
    setEditingId(commentId);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleSaveEdit = useCallback(async (commentId: number, content: string) => {
    try {
      await taskService.updateComment(commentId, { content });
      setEditingId(null);
      onCommentUpdated();
      showSuccess('Comment Updated', 'Your comment has been updated');
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to update comment');
      throw error;
    }
  }, [onCommentUpdated, showSuccess, showError]);

  const handleDelete = useCallback(async (commentId: number) => {
    try {
      await taskService.deleteComment(commentId);
      onCommentDeleted();
      showSuccess('Comment Deleted', 'Comment has been deleted');
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to delete comment');
    }
  }, [onCommentDeleted, showSuccess, showError]);

  const commentItems = useMemo(() => {
    if (comments.length === 0) {
      return (
        <div className="text-center py-4 text-muted">
          <Icon icon="mdi:comment-outline" width={48} className="mb-2 opacity-50" />
          <p className="mb-0">No comments yet. Be the first to comment!</p>
        </div>
      );
    }

    return comments.map(comment => (
      <TaskCommentItem
        key={comment.id}
        comment={comment}
        isOwner={comment.userId === currentUserId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        isEditing={editingId === comment.id}
      />
    ));
  }, [comments, currentUserId, editingId, handleEdit, handleDelete, handleSaveEdit, handleCancelEdit]);

  return (
    <div className="comments-list">
      {commentItems}
    </div>
  );
});

TaskCommentList.displayName = 'TaskCommentList';

export default TaskCommentList;
