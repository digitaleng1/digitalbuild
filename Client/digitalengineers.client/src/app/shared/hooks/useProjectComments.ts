import { useState, useCallback, useEffect } from 'react';
import projectService from '@/services/projectService';
import type { ProjectCommentViewModel } from '@/types/project-comment';
import { useToast } from '@/contexts/ToastContext';

export const useProjectComments = (projectId: number) => {
  const [comments, setComments] = useState<ProjectCommentViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjectComments(projectId);
      setComments(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load comments';
      setError(errorMessage);
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId, showError]);

  const addComment = useCallback(async (
    content: string, 
    mentionedUserIds: string[] = [],
    projectFileIds: number[] = []
  ): Promise<void> => {
    try {
      const newComment = await projectService.addProjectComment(projectId, { 
        content,
        mentionedUserIds: mentionedUserIds.length > 0 ? mentionedUserIds : undefined,
        projectFileIds: projectFileIds.length > 0 ? projectFileIds : undefined
      });
      setComments(prev => [newComment, ...prev]);
      
      const hasFiles = projectFileIds.length > 0;
      const successMessage = hasFiles 
        ? `Your comment with ${projectFileIds.length} file(s) has been posted`
        : 'Your comment has been posted';
      
      showSuccess('Comment Added', successMessage);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add comment';
      showError('Error', errorMessage);
      throw err;
    }
  }, [projectId, showSuccess, showError]);

  const updateComment = useCallback(async (commentId: number, content: string): Promise<void> => {
    try {
      const updatedComment = await projectService.updateProjectComment(commentId, { content });
      setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c));
      showSuccess('Comment Updated', 'Your comment has been updated');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update comment';
      showError('Error', errorMessage);
      throw err;
    }
  }, [showSuccess, showError]);

  const deleteComment = useCallback(async (commentId: number) => {
    try {
      await projectService.deleteProjectComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      showSuccess('Comment Deleted', 'Your comment has been deleted');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete comment';
      showError('Error', errorMessage);
      throw err;
    }
  }, [showSuccess, showError]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    refreshComments: fetchComments
  };
};
