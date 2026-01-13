import { Form } from 'react-bootstrap';
import type { ProjectSpecialistDto } from '@/types/project';

interface UserSelectorProps {
  members: ProjectSpecialistDto[];
  value?: string;
  onChange: (userId: string | undefined) => void;
  disabled?: boolean;
}

const UserSelector = ({ members, value, onChange, disabled = false }: UserSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue === '' ? undefined : selectedValue);
  };

  const assignedMembers = members.filter(m => m.isAssigned);

  return (
    <Form.Select
      value={value || ''}
      onChange={handleChange}
      disabled={disabled || assignedMembers.length === 0}
    >
      <option value="">Unassigned</option>
      {assignedMembers.map(member => (
        <option key={member.userId} value={member.userId}>
          {member.name} {member.role ? `(${member.role})` : ''}
        </option>
      ))}
    </Form.Select>
  );
};

export default UserSelector;
