import React from 'react';
import type { ProjectCommentViewModel, MentionableUser } from '@/types/project-comment';
import ProjectCommentItem from './ProjectCommentItem';
import ProjectCommentForm from './ProjectCommentForm';

interface ProjectCommentListProps {
  comments: ProjectCommentViewModel[];
  loading: boolean;
  users: MentionableUser[];
  onAddComment: (content: string, mentionedUserIds: string[]) => Promise<void>;
  onEditComment: (commentId: number, content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

const ProjectCommentList: React.FC<ProjectCommentListProps> = ({
  comments,
  loading,
  users,
  onAddComment,
  onEditComment,
  onDeleteComment
}) => {
  return (
    <>
      <h4 className="mt-0 mb-3">Comments ({comments.length})</h4>
      
      <ProjectCommentForm onSubmit={onAddComment} users={users} />
      
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-muted mt-4">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="mt-4">
          {comments.map(comment => (
            <ProjectCommentItem
              key={comment.id}
              comment={comment}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectCommentList;
