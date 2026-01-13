import { Form } from 'react-bootstrap';

interface ParentTaskSelectorProps {
  tasks: Array<{ id: number; title: string }>;
  value?: number;
  onChange: (taskId: number | undefined) => void;
  disabled?: boolean;
}

const ParentTaskSelector = ({ tasks, value, onChange, disabled = false }: ParentTaskSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue === '' ? undefined : Number(selectedValue));
  };

  return (
    <Form.Select
      value={value || ''}
      onChange={handleChange}
      disabled={disabled}
    >
      <option value="">None (Root Task)</option>
      {tasks.map(task => (
        <option key={task.id} value={task.id}>
          #{task.id} | {task.title}
        </option>
      ))}
    </Form.Select>
  );
};

export default ParentTaskSelector;
