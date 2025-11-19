import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { taskService } from '@/services/taskService';
import type { TaskStatusViewModel } from '@/types/task';

interface CreateTaskModalProps {
	show: boolean;
	onHide: () => void;
	projectId: number;
	statuses: TaskStatusViewModel[];
	onSuccess: () => void;
}

interface CreateTaskForm {
	title: string;
	description: string;
	priority: number;
	statusId: number;
	deadline?: string;
}

const CreateTaskModal = ({ show, onHide, projectId, statuses, onSuccess }: CreateTaskModalProps) => {
	const [formData, setFormData] = useState<CreateTaskForm>({
		title: '',
		description: '',
		priority: 1,
		statusId: statuses[0]?.id || 0,
		deadline: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === 'priority' || name === 'statusId' ? Number(value) : value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.title.trim()) {
			setError('Title is required');
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			await taskService.createTask({
				projectId,
				title: formData.title,
				description: formData.description,
				priority: formData.priority,
				statusId: formData.statusId,
				deadline: formData.deadline || undefined,
				isMilestone: false,
				assignedToUserId: undefined,
				parentTaskId: undefined,
				labelIds: []
			});

			setFormData({
				title: '',
				description: '',
				priority: 1,
				statusId: statuses[0]?.id || 0,
				deadline: ''
			});

			onSuccess();
			onHide();
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to create task');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setFormData({
			title: '',
			description: '',
			priority: 1,
			statusId: statuses[0]?.id || 0,
			deadline: ''
		});
		setError(null);
		onHide();
	};

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>Create New Task</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}

				<Form onSubmit={handleSubmit}>
					<Row>
						<Col md={8}>
							<Form.Group className="mb-3">
								<Form.Label>Title <span className="text-danger">*</span></Form.Label>
								<Form.Control
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									placeholder="Enter task title"
									disabled={isSubmitting}
									required
								/>
							</Form.Group>
						</Col>

						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label>Priority</Form.Label>
								<Form.Select
									name="priority"
									value={formData.priority}
									onChange={handleChange}
									disabled={isSubmitting}
								>
									<option value={0}>Low</option>
									<option value={1}>Medium</option>
									<option value={2}>High</option>
								</Form.Select>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={3}
							placeholder="Enter task description"
							disabled={isSubmitting}
						/>
					</Form.Group>

					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Status</Form.Label>
								<Form.Select
									name="statusId"
									value={formData.statusId}
									onChange={handleChange}
									disabled={isSubmitting}
								>
									{statuses.map(status => (
										<option key={status.id} value={status.id}>
											{status.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Deadline</Form.Label>
								<Form.Control
									type="date"
									name="deadline"
									value={formData.deadline}
									onChange={handleChange}
									disabled={isSubmitting}
								/>
							</Form.Group>
						</Col>
					</Row>

					<div className="text-end">
						<Button variant="light" onClick={handleClose} disabled={isSubmitting} className="me-2">
							Cancel
						</Button>
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<span className="spinner-border spinner-border-sm me-1" role="status"></span>
									Creating...
								</>
							) : (
								'Create Task'
							)}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default CreateTaskModal;
