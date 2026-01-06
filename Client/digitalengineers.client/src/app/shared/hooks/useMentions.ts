import { useState, useCallback, useRef, useEffect } from 'react';
import type { MentionableUser } from '@/types/project-comment';

interface UseMentionsReturn {
  showDropdown: boolean;
  filteredUsers: MentionableUser[];
  selectedIndex: number;
  dropdownPosition: { top: number; left: number };
  handleInput: (value: string, cursorPosition: number, inputRef: HTMLTextAreaElement | null) => void;
  handleKeyDown: (e: React.KeyboardEvent, onSelect: (user: MentionableUser) => void) => void;
  selectUser: (user: MentionableUser, currentValue: string, cursorPosition: number) => { newValue: string; newCursorPosition: number; mentionedUserIds: string[] };
  extractMentionedUserIds: (content: string) => string[];
  reset: () => void;
}

/**
 * Hook for handling mention functionality in textarea
 * Detects @ character, filters users, handles keyboard navigation
 */
export function useMentions(users: MentionableUser[]): UseMentionsReturn {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<MentionableUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null);
  
  // Store mentioned user IDs with their names for matching
  const mentionsMapRef = useRef<Map<string, string>>(new Map());

  /**
   * Calculate cursor position in textarea for dropdown placement
   */
  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    const div = document.createElement('div');
    const style = getComputedStyle(element);
    
    // Copy textarea styles to div
    ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'padding', 'border', 'boxSizing'].forEach(prop => {
      div.style[prop as any] = style[prop as any];
    });
    
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.width = `${element.clientWidth}px`;
    
    const text = element.value.substring(0, position);
    div.textContent = text;
    
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    
    document.body.appendChild(div);
    
    const rect = element.getBoundingClientRect();
    const coordinates = {
      top: rect.top + span.offsetTop + parseInt(style.fontSize) + 5,
      left: rect.left + span.offsetLeft
    };
    
    document.body.removeChild(div);
    return coordinates;
  };

  /**
   * Handle input changes and detect @ mentions
   */
  const handleInput = useCallback((value: string, cursorPosition: number, inputRef: HTMLTextAreaElement | null) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    // Check if @ was typed and not part of completed mention
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // Check if there's a space after @, which means it's not a mention anymore
      if (textAfterAt.includes(' ')) {
        setShowDropdown(false);
        setMentionStartPos(null);
        return;
      }
      
      // Filter users by search query
      const query = textAfterAt.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query)
      );
      
      if (filtered.length > 0) {
        setSearchQuery(textAfterAt);
        setFilteredUsers(filtered);
        setSelectedIndex(0);
        setMentionStartPos(lastAtIndex);
        setShowDropdown(true);
        
        // Calculate dropdown position
        if (inputRef) {
          const coords = getCaretCoordinates(inputRef, cursorPosition);
          setDropdownPosition(coords);
        }
      } else {
        setShowDropdown(false);
      }
    } else {
      setShowDropdown(false);
      setMentionStartPos(null);
    }
  }, [users]);

  /**
   * Handle keyboard navigation in dropdown
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent, onSelect: (user: MentionableUser) => void) => {
    if (!showDropdown) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        break;
      case 'Enter':
        if (filteredUsers.length > 0) {
          e.preventDefault();
          onSelect(filteredUsers[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        break;
    }
  }, [showDropdown, filteredUsers, selectedIndex]);

  /**
   * Select user and insert mention into text
   */
  const selectUser = useCallback((user: MentionableUser, currentValue: string, cursorPosition: number): { newValue: string; newCursorPosition: number; mentionedUserIds: string[] } => {
    if (mentionStartPos === null) {
      return { newValue: currentValue, newCursorPosition: cursorPosition, mentionedUserIds: [] };
    }
    
    // Store mention mapping
    mentionsMapRef.current.set(user.name, user.userId);
    
    // Replace @query with @Name
    const beforeMention = currentValue.substring(0, mentionStartPos);
    const afterCursor = currentValue.substring(cursorPosition);
    const mention = `@${user.name}`;
    const newValue = beforeMention + mention + ' ' + afterCursor;
    const newCursorPosition = beforeMention.length + mention.length + 1;
    
    // Extract all mentioned user IDs
    const mentionedUserIds = extractMentionedUserIds(newValue);
    
    setShowDropdown(false);
    setMentionStartPos(null);
    
    return { newValue, newCursorPosition, mentionedUserIds };
  }, [mentionStartPos]);

  /**
   * Extract mentioned user IDs from content
   */
  const extractMentionedUserIds = useCallback((content: string): string[] => {
    // Match @Name only if preceded by start/space and followed by space/punctuation/end
    const mentionRegex = /(?:^|(?<=\s))@([A-Za-z]+(?:\s[A-Za-z]+)*)(?=\s|[.,!?;:]|$)/g;
    const matches = content.match(mentionRegex);
    
    if (!matches) return [];
    
    const userIds: string[] = [];
    matches.forEach(match => {
      // Remove @ symbol (trim handles any captured space from lookbehind)
      const name = match.trim().substring(1);
      const userId = mentionsMapRef.current.get(name);
      
      if (userId && !userIds.includes(userId)) {
        userIds.push(userId);
      } else {
        // Try to find user by name in the users list
        const user = users.find(u => u.name === name);
        if (user && !userIds.includes(user.userId)) {
          userIds.push(user.userId);
          mentionsMapRef.current.set(name, user.userId);
        }
      }
    });
    
    return userIds;
  }, [users]);

  /**
   * Reset mention state
   */
  const reset = useCallback(() => {
    setShowDropdown(false);
    setFilteredUsers([]);
    setSelectedIndex(0);
    setSearchQuery('');
    setMentionStartPos(null);
    mentionsMapRef.current.clear();
  }, []);

  return {
    showDropdown,
    filteredUsers,
    selectedIndex,
    dropdownPosition,
    handleInput,
    handleKeyDown,
    selectUser,
    extractMentionedUserIds,
    reset
  };
}
