import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';

interface TagInputProps {
	label: string;
	placeholder: string;
	helpText?: string;
	value: string[];
	onChange: (tags: string[]) => void;
	maxLength?: number;
}

const TagInput = ({ label, placeholder, helpText, value, onChange, maxLength = 100 }: TagInputProps) => {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	const addTag = useCallback(() => {
		const trimmedValue = inputValue.trim();
		if (trimmedValue && !value.includes(trimmedValue)) {
			onChange([...value, trimmedValue]);
			setInputValue('');
		}
	}, [inputValue, value, onChange]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addTag();
			}
		},
		[addTag]
	);

	const removeTag = useCallback(
		(tagToRemove: string) => {
			onChange(value.filter((tag) => tag !== tagToRemove));
		},
		[value, onChange]
	);

	return (
		<Form.Group className="mb-3">
			<Form.Label>{label}</Form.Label>
			<div className="d-flex gap-2 mb-2">
				<Form.Control
					type="text"
					placeholder={placeholder}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					maxLength={maxLength}
				/>
				<Button variant="primary" onClick={addTag} disabled={!inputValue.trim()}>
					<i className="mdi mdi-plus"></i>
				</Button>
			</div>
			{helpText && <Form.Text className="text-muted d-block mb-2">{helpText}</Form.Text>}
			<div className="d-flex flex-wrap gap-2">
				{value.map((tag, index) => (
					<Badge key={index} bg="info" className="d-flex align-items-center gap-1">
						{tag}
						<i
							className="mdi mdi-close"
							style={{ cursor: 'pointer' }}
							onClick={() => removeTag(tag)}
						></i>
					</Badge>
				))}
			</div>
		</Form.Group>
	);
};

export default TagInput;
