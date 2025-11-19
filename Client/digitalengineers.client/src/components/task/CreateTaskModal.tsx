import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { taskService } from '@/services/taskService';
import projectService from '@/services/projectService';
import type { TaskStatusViewModel, CreateTaskViewModel, TaskLabelViewModel, TaskPriority } from '@/types/task';
import type { ProjectSpecialistDto } from '@/types/project';
import UserSelector from './UserSelector';
import ParentTaskSelector from './ParentTaskSelector';
import LabelSelector from './LabelSelector';

interface CreateTaskModalProps {
	show: boolean;
	onHide: () => void;
	projectId: number;
	statuses: TaskStatusViewModel[];
	onSuccess: () => void;
}

const CreateTaskModal = ({ show, onHide, projectId, statuses, onSuccess }: CreateTaskModalProps) => {
	const [formData, setFormData] = useState<CreateTaskViewModel>({
		title: '',
		description: '',
		priority: 1 as TaskPriority,
		statusId: statuses[0]?.id || 0,
		deadline: '',
		isMilestone: false,
		assignedToUserId: undefined,
		parentTaskId: undefined,
		labelIds: [],
		projectId: projectId
	});
	
	const [projectMembers, setProjectMembers] = useState<ProjectSpecialistDto[]>([]);
	const [taskLabels, setTaskLabels] = useState<TaskLabelViewModel[]>([]);
	const [parentTasks, setParentTasks] = useState<Array<{ id: number; title: string }>>([]);
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (show) {
			loadData();
		}
	}, [show, projectId]);

	const loadData = async () => {
		setIsLoadingData(true);
		try {
			const [members, labels, tasks] = await Promise.all([
				projectService.getProjectTeamMembers(projectId),
				taskService.getLabelsByProject(projectId),
				taskService.getTasksForSelection(projectId)
			]);
			
			setProjectMembers(members || []);
			setTaskLabels(labels || []);
			setParentTasks(tasks || []);
		} catch (err) {
			console.error('Failed to load data:', err);
			setProjectMembers([]);
			setTaskLabels([]);
			setParentTasks([]);
		} finally {
			setIsLoadingData(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === 'priority' || name === 'statusId' ? Number(value) : value
		}));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: checked
		}));
	};

	const handleCreateLabel = async (dto: { name: string; color: string }) => {
		try {
			const newLabel = await taskService.createLabel({ ...dto, projectId });
			setTaskLabels(prev => [...prev, newLabel]);
			return newLabel;
		} catch (error) {
			console.error('Failed to create label:', error);
			throw error;
		}
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
				...formData,
				deadline: formData.deadline || undefined,
			});

			// Reset form
			setFormData({
				title: '',
				description: '',
				priority: 1 as TaskPriority,
				statusId: statuses[0]?.id || 0,
				deadline: '',
				isMilestone: false,
				assignedToUserId: undefined,
				parentTaskId: undefined,
				labelIds: [],
				projectId: projectId
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
			priority: 1 as TaskPriority,
			statusId: statuses[0]?.id || 0,
			deadline: '',
			isMilestone: false,
			assignedToUserId: undefined,
			parentTaskId: undefined,
			labelIds: [],
			projectId: projectId
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

				{isLoadingData && (
					<div className="text-center mb-3">
						<span className="spinner-border spinner-border-sm me-2" role="status"></span>
						Loading data...
					</div>
				)}

				<Form onSubmit={handleSubmit}>
					{/* Row 1: Title + Priority */}
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
									<option value={3}>Critical</option>
								</Form.Select>
							</Form.Group>
						</Col>
					</Row>

					{/* Row 2: Description */}
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

					{/* Row 3: Milestone Checkbox */}
					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							name="isMilestone"
							label="Mark as Milestone"
							checked={formData.isMilestone}
							onChange={handleCheckboxChange}
							disabled={isSubmitting}
						/>
						<Form.Text className="text-muted">
							<Icon icon="mdi:flag" width={14} className="me-1" />
							Milestones are highlighted in the task list
						</Form.Text>
					</Form.Group>

					{/* Row 4: Status + Deadline */}
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

					{/* Row 5: Assign To + Parent Task */}
					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Assign To</Form.Label>
								<UserSelector
									members={projectMembers}
									value={formData.assignedToUserId}
									onChange={(userId) => setFormData(prev => ({ ...prev, assignedToUserId: userId }))}
								/>
								{projectMembers.filter(m => m.isAssigned).length === 0 && (
									<Form.Text className="text-muted">
										No team members assigned to this project yet
									</Form.Text>
								)}
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Parent Task</Form.Label>
								<ParentTaskSelector
									tasks={parentTasks}
									value={formData.parentTaskId}
									onChange={(taskId) => setFormData(prev => ({ ...prev, parentTaskId: taskId }))}
								/>
								<Form.Text className="text-muted">
									Create this task as a subtask of another task
								</Form.Text>
							</Form.Group>
						</Col>
					</Row>

					{/* Row 6: Labels */}
					<Form.Group className="mb-3">
						<Form.Label>Labels</Form.Label>
						<LabelSelector
							availableLabels={taskLabels}
							selectedLabelIds={formData.labelIds}
							onChange={(labelIds) => setFormData(prev => ({ ...prev, labelIds }))}
							onCreateLabel={handleCreateLabel}
						/>
					</Form.Group>

					{/* Action Buttons */}
					<div className="text-end">
						<Button variant="light" onClick={handleClose} disabled={isSubmitting} className="me-2">
							Cancel
						</Button>
						<Button variant="primary" type="submit" disabled={isSubmitting || isLoadingData}>
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
