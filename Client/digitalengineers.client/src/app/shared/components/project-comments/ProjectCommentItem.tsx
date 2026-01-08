import React, { useState, useCallback } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { ProjectCommentViewModel } from '@/types/project-comment';
import { useAuthContext } from '@/common/context/useAuthContext';
import { formatFileSize } from '@/utils/projectUtils';

import avatar1 from '@/assets/images/users/avatar-1.jpg';

interface ProjectCommentItemProps {
  comment: ProjectCommentViewModel;
  onEdit: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

const renderContentWithMentions = (content: string): (string | React.ReactNode)[] => {
  // Match @Name only if preceded by start/space and followed by space/punctuation/end
  const mentionRegex = /(?:^|(?<=\s))@([A-Za-z]+(?:\s[A-Za-z]+)*)(?=\s|[.,!?;:]|$)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    // Add highlighted mention
    parts.push(
      <span key={`mention-${match.index}`} className="mention">
        @{match[1]}
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [content];
};

const getFileIcon = (contentType: string) => {
  if (contentType.startsWith('image/')) return 'mdi:file-image';
  if (contentType.includes('pdf')) return 'mdi:file-pdf-box';
  if (contentType.includes('word') || contentType.includes('document')) return 'mdi:file-word';
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'mdi:file-excel';
  if (contentType.includes('zip') || contentType.includes('compressed')) return 'mdi:folder-zip';
  return 'mdi:file-document';
};

const getFileColor = (contentType: string) => {
  if (contentType.startsWith('image/')) return 'primary';
  if (contentType.includes('pdf')) return 'danger';
  if (contentType.includes('word') || contentType.includes('document')) return 'info';
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'success';
  if (contentType.includes('zip') || contentType.includes('compressed')) return 'secondary';
  return 'dark';
};

const ProjectCommentItem: React.FC<ProjectCommentItemProps> = ({
  comment,
  onEdit,
  onDelete
}) => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnComment = user?.id === comment.userId;

  const handleEdit = useCallback(async () => {
    if (!editContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  }, [comment.id, editContent, onEdit]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await onDelete(comment.id);
    } catch (error) {
      // Error handling is done in the hook
    }
  }, [comment.id, onDelete]);

  const handleCancel = useCallback(() => {
    setEditContent(comment.content);
    setIsEditing(false);
  }, [comment.content]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (editContent.trim()) {
        handleEdit();
      }
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  }, [editContent, handleEdit, handleCancel]);

  const timeAgo = formatTimeAgo(comment.createdAt);
  const hasAttachedFiles = comment.fileReferences && comment.fileReferences.length > 0;
  const hasMentions = comment.mentionedUserNames && comment.mentionedUserNames.length > 0;

  return (
    <div className="d-flex align-items-start mb-3">
      <img 
        className="me-3 avatar-sm rounded-circle" 
        src={comment.userProfilePictureUrl || avatar1} 
        alt={comment.userName} 
      />
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mt-0 mb-0">
            {comment.userName}
            {comment.isEdited && (
              <span className="badge badge-soft-secondary ms-2">Edited</span>
            )}
          </h5>
          {isOwnComment && !isEditing && (
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="link" 
                className="arrow-none card-drop p-0"
                bsPrefix="no-caret"
              >
                <Icon icon="mdi:dots-vertical" width={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setIsEditing(true)}>
                  <Icon icon="mdi:pencil" width={16} className="me-1" />
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDelete} className="text-danger">
                  <Icon icon="mdi:delete" width={16} className="me-1" />
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        
        <p className="text-muted font-13 mb-2">{timeAgo}</p>
        
        {/* Mentioned Users - Show if present */}
        {hasMentions && (
          <div className="mb-2">
            {comment.mentionedUserNames.map((name, index) => (
              <Badge 
                key={`mention-${index}`} 
                bg="primary" 
                className="me-1"
                style={{ fontSize: '0.75rem' }}
              >
                <Icon icon="mdi:at" width={14} className="me-1" />
                {name}
              </Badge>
            ))}
          </div>
        )}
        
        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="form-control mb-2"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              autoFocus
            />
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={handleEdit}
                disabled={!editContent.trim() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {renderContentWithMentions(comment.content)}
            </p>
            
            {hasAttachedFiles && (
              <div className="mt-2 attached-files">
                {comment.fileReferences.map((file) => {
                  const icon = getFileIcon(file.contentType);
                  const color = getFileColor(file.contentType);
                  
                  return (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`d-inline-flex align-items-center text-decoration-none border rounded px-2 py-1 me-2 mb-2 text-${color}`}
                      style={{ fontSize: '0.875rem' }}
                    >
                      <Icon icon={icon} width={18} className="me-1" />
                      <span className="me-1">{file.fileName}</span>
                      <small className="text-muted">({formatFileSize(file.fileSize)})</small>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCommentItem;
