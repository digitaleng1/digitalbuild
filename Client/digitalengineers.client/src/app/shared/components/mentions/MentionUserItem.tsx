import React from 'react';
import type { MentionableUser } from '@/types/project-comment';
import avatar from '@/assets/images/users/avatar-1.jpg';

interface MentionUserItemProps {
  user: MentionableUser;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Single user item in mention dropdown
 */
const MentionUserItem: React.FC<MentionUserItemProps> = ({ user, isSelected, onClick }) => {
  return (
    <div
      className={`mention-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()} // Prevent textarea blur
    >
      <img
        src={user.profilePictureUrl || avatar}
        alt={user.name}
        className="mention-avatar"
      />
      <span className="mention-name">{user.name}</span>
    </div>
  );
};

export default MentionUserItem;
