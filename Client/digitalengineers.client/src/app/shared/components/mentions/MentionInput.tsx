import React, { useRef, useState, useCallback } from 'react';
import type { MentionableUser } from '@/types/project-comment';
import { useMentions } from '@/app/shared/hooks/useMentions';
import MentionDropdown from './MentionDropdown';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  users: MentionableUser[];
  onMentionsChange?: (userIds: string[]) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Textarea with @mention functionality
 * Detects @ character and shows dropdown with users
 */
const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  users,
  onMentionsChange,
  placeholder = 'Type @ to mention someone...',
  rows = 3,
  disabled = false,
  className = ''
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const {
    showDropdown,
    filteredUsers,
    selectedIndex,
    dropdownPosition,
    handleInput,
    handleKeyDown,
    selectUser,
    extractMentionedUserIds
  } = useMentions(users);

  /**
   * Handle textarea input change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newCursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(newCursorPos);
    handleInput(newValue, newCursorPos, textareaRef.current);
    
    // Extract and notify about mentioned user IDs
    if (onMentionsChange) {
      const mentionedIds = extractMentionedUserIds(newValue);
      onMentionsChange(mentionedIds);
    }
  }, [onChange, handleInput, onMentionsChange, extractMentionedUserIds]);

  /**
   * Handle user selection from dropdown
   */
  const handleSelectUser = useCallback((user: MentionableUser) => {
    const result = selectUser(user, value, cursorPosition);
    onChange(result.newValue);
    
    // Notify about mentioned user IDs
    if (onMentionsChange) {
      onMentionsChange(result.mentionedUserIds);
    }
    
    // Set cursor position after mention
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
      }
    }, 0);
  }, [selectUser, value, cursorPosition, onChange, onMentionsChange]);

  /**
   * Handle keyboard events
   */
  const handleKeyDownEvent = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, handleSelectUser);
  }, [handleKeyDown, handleSelectUser]);

  return (
    <div className="mention-input-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDownEvent}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`form-control ${className}`}
      />
      <MentionDropdown
        users={filteredUsers}
        selectedIndex={selectedIndex}
        position={dropdownPosition}
        onSelect={handleSelectUser}
        show={showDropdown}
      />
    </div>
  );
};

export default MentionInput;
