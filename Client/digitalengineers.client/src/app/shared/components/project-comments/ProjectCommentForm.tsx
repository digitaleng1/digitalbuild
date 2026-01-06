import React, { useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { MentionInput } from '@/app/shared/components/mentions';
import type { MentionableUser } from '@/types/project-comment';

interface ProjectCommentFormProps {
  onSubmit: (content: string, mentionedUserIds: string[]) => Promise<void>;
  users: MentionableUser[];
  placeholder?: string;
  submitButtonText?: string;
}

const ProjectCommentForm: React.FC<ProjectCommentFormProps> = ({
  onSubmit,
  users,
  placeholder = 'Add a comment... Type @ to mention someone (Ctrl+Enter to submit)',
  submitButtonText = 'Submit'
}) => {
  const [content, setContent] = useState('');
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim(), mentionedUserIds);
      setContent('');
      setMentionedUserIds([]);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  }, [content, mentionedUserIds, onSubmit]);

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
        <MentionInput
          value={content}
          onChange={setContent}
          users={users}
          onMentionsChange={setMentionedUserIds}
          placeholder={placeholder}
          rows={3}
          disabled={isSubmitting}
          className="border-0 resize-none"
        />
        <div className="p-2 bg-light d-flex justify-content-between align-items-center">
          <div className="text-muted font-12">
            {content.length > 0 && `${content.length} characters`}
            {mentionedUserIds.length > 0 && ` • ${mentionedUserIds.length} mention${mentionedUserIds.length > 1 ? 's' : ''}`}
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
                {submitButtonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCommentForm;
