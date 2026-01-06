import React, { useEffect, useRef } from 'react';
import type { MentionableUser } from '@/types/project-comment';
import MentionUserItem from './MentionUserItem';

interface MentionDropdownProps {
  users: MentionableUser[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (user: MentionableUser) => void;
  show: boolean;
}

/**
 * Dropdown component for displaying mentionable users
 */
const MentionDropdown: React.FC<MentionDropdownProps> = ({
  users,
  selectedIndex,
  position,
  onSelect,
  show
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current && users.length > 0) {
      const selectedItem = dropdownRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, users.length]);

  if (!show || users.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="mention-dropdown"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      {users.map((user, index) => (
        <MentionUserItem
          key={user.userId}
          user={user}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(user)}
        />
      ))}
    </div>
  );
};

export default MentionDropdown;
