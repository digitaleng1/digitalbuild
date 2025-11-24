import React, { useState, useCallback, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { TaskCommentViewModel } from '@/types/task';

dayjs.extend(relativeTime);

interface TaskCommentItemProps {
  comment: TaskCommentViewModel;
  isOwner: boolean;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onSaveEdit: (commentId: number, content: string) => Promise<void>;
  onCancelEdit: () => void;
  isEditing: boolean;
}

const TaskCommentItem = React.memo(({
  comment,
  isOwner,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  isEditing
}: TaskCommentItemProps) => {
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = useMemo(() => 
    dayjs(comment.createdAt).fromNow(),
    [comment.createdAt]
  );

  const handleEditClick = useCallback(() => {
    setEditContent(comment.content);
    onEdit(comment.id);
  }, [comment.id, comment.content, onEdit]);

  const handleDeleteClick = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  }, [comment.id, onDelete]);

  const handleSaveClick = useCallback(async () => {
    if (!editContent.trim()) return;
    
    try {
      setIsSaving(true);
      await onSaveEdit(comment.id, editContent.trim());
    } finally {
      setIsSaving(false);
    }
  }, [comment.id, editContent, onSaveEdit]);

  const handleCancelClick = useCallback(() => {
    setEditContent(comment.content);
    onCancelEdit();
  }, [comment.content, onCancelEdit]);

  const userInitials = useMemo(() => {
    if (!comment.userName) return '?';
    const parts = comment.userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return comment.userName[0].toUpperCase();
  }, [comment.userName]);

  return (
    <div className="d-flex mt-3 p-2 border-bottom">
      <div className="me-3">
        {comment.userProfilePictureUrl ? (
          <img 
            src={comment.userProfilePictureUrl} 
            alt={comment.userName} 
            className="rounded-circle" 
            width="36" 
            height="36"
          />
        ) : (
          <div 
            className="avatar-sm d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
            style={{ width: '36px', height: '36px' }}
          >
            <span className="font-14">{userInitials}</span>
          </div>
        )}
      </div>

      <div className="w-100">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div>
            <h5 className="mt-0 mb-0 font-14 fw-bold">{comment.userName}</h5>
            <small className="text-muted">
              {formattedDate}
              {comment.isEdited && (
                <span className="ms-2">
                  <Icon icon="mdi:pencil" width={12} className="me-1" />
                  Edited
                </span>
              )}
            </small>
          </div>

          {isOwner && !isEditing && (
            <div className="d-flex gap-1">
              <Button
                variant="link"
                size="sm"
                className="p-1 text-muted"
                onClick={handleEditClick}
                title="Edit comment"
              >
                <Icon icon="mdi:pencil" width={16} />
              </Button>
              <Button
                variant="link"
                size="sm"
                className="p-1 text-danger"
                onClick={handleDeleteClick}
                title="Delete comment"
              >
                <Icon icon="mdi:delete" width={16} />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="form-control form-control-sm"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={isSaving}
              autoFocus
            />
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="success"
                size="sm"
                onClick={handleSaveClick}
                disabled={!editContent.trim() || isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:check" width={16} className="me-1" />
                    Save
                  </>
                )}
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={handleCancelClick}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
});

TaskCommentItem.displayName = 'TaskCommentItem';

export default TaskCommentItem;
