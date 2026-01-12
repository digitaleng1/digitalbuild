import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardBody } from 'react-bootstrap';
import { useProjectComments } from '@/app/shared/hooks/useProjectComments';
import { ProjectCommentList } from '@/app/shared/components/project-comments';
import projectService from '@/services/projectService';
import type { MentionableUser } from '@/types/project-comment';

interface CommentsProps {
  projectId: number;
}

export interface CommentsRef {
  refreshComments: () => Promise<void>;
}

const Comments = forwardRef<CommentsRef, CommentsProps>(({ projectId }, ref) => {
  const [mentionableUsers, setMentionableUsers] = useState<MentionableUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    refreshComments
  } = useProjectComments(projectId);

  useImperativeHandle(ref, () => ({
    refreshComments
  }), [refreshComments]);
  
  // Fetch mentionable users
  useEffect(() => {
    const fetchMentionableUsers = async () => {
      try {
        setLoadingUsers(true);
        const users = await projectService.getProjectMentionableUsers(projectId);
        setMentionableUsers(users);
      } catch (error) {
        console.error('Failed to fetch mentionable users:', error);
        setMentionableUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchMentionableUsers();
  }, [projectId]);

  return (
    <Card>
      <CardBody>
        <ProjectCommentList
          comments={comments}
          loading={loading || loadingUsers}
          users={mentionableUsers}
          onAddComment={addComment}
          onEditComment={updateComment}
          onDeleteComment={deleteComment}
        />
      </CardBody>
    </Card>
  );
});

Comments.displayName = 'Comments';

export default Comments;
