
import { Form } from 'react-bootstrap';
import {type Control, Controller, type RegisterOptions } from 'react-hook-form';

type FileInputProps = {
	type?: 'file';
	id?: string;
	name: string;
	className?: string;
	containerClass?: string;
	label?: string;
	helpText?: string;
	readOnly?: boolean;
	disabled?: boolean;
	errors?: any;
	control?: Control<any>;
	register?: RegisterOptions;
};

export default function FileInput({
	type = 'file',
	name,
	id,
	control,
	className,
	containerClass,
	label,
	helpText,
	errors,
	register,
	...props
}: FileInputProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Form.Group className={containerClass ?? ''}>
					{label && <Form.Label>{label}</Form.Label>}
					<Form.Control
						type={type}
						id={id}
						{...props}
						{...field}
						value={field.value ?? ''}
						onChange={(e) => {
							field.onChange(e.target.value);
						}}
						className={className}
						isInvalid={Boolean(fieldState.error?.message)}
					/>
					{helpText && (
						<Form.Text id={`${name}-help`} muted>
							{helpText}
						</Form.Text>
					)}
					{errors || (fieldState.error && <Form.Control.Feedback type="invalid">{fieldState.error['message']}</Form.Control.Feedback>)}
				</Form.Group>
			)}
		/>
	);
}
