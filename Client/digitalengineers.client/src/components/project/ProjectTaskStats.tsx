import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { taskService } from '@/services/taskService';
import type { TaskViewModel } from '@/types/task';
import type { ProjectDto } from '@/types/project';
import { getStatusBadgeVariant } from '@/utils/projectUtils';

interface ProjectTaskStatsProps {
	projectId: number;
	project: ProjectDto;
}

interface TaskStats {
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	teamMembersCount: number;
}

const ProjectTaskStats = ({ projectId, project }: ProjectTaskStatsProps) => {
	const [stats, setStats] = useState<TaskStats>({
		totalTasks: 0,
		completedTasks: 0,
		inProgressTasks: 0,
		teamMembersCount: 0
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadStats = async () => {
			try {
				setLoading(true);
				const tasks = await taskService.getTasksByProject(projectId);
				
				const completedStatusIds = tasks
					.filter(t => t.statusName.toLowerCase().includes('complete') || t.statusName.toLowerCase().includes('done'))
					.map(t => t.statusId);
				
				const uniqueAssignees = new Set(
					tasks
						.filter(t => t.assignedToUserId)
						.map(t => t.assignedToUserId)
				);

				setStats({
					totalTasks: tasks.length,
					completedTasks: tasks.filter(t => completedStatusIds.includes(t.statusId)).length,
					inProgressTasks: tasks.filter(t => !completedStatusIds.includes(t.statusId)).length,
					teamMembersCount: uniqueAssignees.size
				});
			} catch (error) {
				console.error('Failed to load task statistics:', error);
			} finally {
				setLoading(false);
			}
		};

		loadStats();
	}, [projectId]);

	const completionPercentage = stats.totalTasks > 0 
		? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
		: 0;

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h4 className="mb-0">{project.name}</h4>
				<div className="d-flex align-items-center">
					<span className={`badge bg-${getStatusBadgeVariant(project.status)} me-2`} style={{ textTransform: 'capitalize' }}>
						{project.status}
					</span>
					{project.clientName && (
						<div className="d-flex align-items-center text-muted">
							{project.clientProfilePictureUrl ? (
								<img 
									src={project.clientProfilePictureUrl} 
									style={{ width: '1.5rem', height: '1.5rem', objectFit: 'cover' }} 
									alt={project.clientName}
									className="rounded-circle img-thumbnail me-2"
									title={project.clientName}
								/>
							) : (
								<i className="ri-user-line me-1"></i>
							)}
							<span>{project.clientName}</span>
						</div>
					)}
				</div>
			</div>

			<Card className="widget-inline">
				<Card.Body className="p-0">
					<Row className="g-0">
						<Col sm={6} lg={3}>
							<Card className="rounded-0 shadow-none m-0 border-end border-light">
								<Card.Body className="text-center">
									{project.thumbnailUrl ? (
										<img 
											src={project.thumbnailUrl} 
											style={{ width: '3rem', height: '3rem', objectFit: 'cover' }} 
											alt={project.name}
											className="rounded-circle img-thumbnail mb-2"
										/>
									) : (
										<div 
											className="d-flex align-items-center justify-content-center rounded-circle bg-light mb-2"
											style={{ width: '3rem', height: '3rem', margin: '0 auto' }}
										>
											<i className="ri-image-line text-muted" style={{ fontSize: '1.5rem' }}></i>
										</div>
									)}
									<p className="font-13 mb-1">
										<i className="ri-calendar-line me-1"></i>
										{new Date(project.createdAt).toLocaleDateString()}
									</p>
									<p className="text-muted font-15 mb-0">
										<i className="ri-map-pin-line me-1"></i>
										{project.city}, {project.state}
									</p>
								</Card.Body>
							</Card>
						</Col>

						<Col sm={6} lg={3}>
							<Card className="rounded-0 shadow-none m-0 border-end border-light">
								<Card.Body className="text-center">
									<i className="ri-list-check-2 text-muted font-24"></i>
									<h3>
										{loading ? (
											<span className="spinner-border spinner-border-sm" role="status"></span>
										) : (
											<span>{stats.totalTasks}</span>
										)}
									</h3>
									<p className="text-muted font-15 mb-0">Total Tasks</p>
								</Card.Body>
							</Card>
						</Col>

						<Col sm={6} lg={3}>
							<Card className="rounded-0 shadow-none m-0 border-end border-light">
								<Card.Body className="text-center">
									<i className="ri-group-line text-muted font-24"></i>
									<h3>
										{loading ? (
											<span className="spinner-border spinner-border-sm" role="status"></span>
										) : (
											<span>{stats.teamMembersCount}</span>
										)}
									</h3>
									<p className="text-muted font-15 mb-0">Team Members</p>
								</Card.Body>
							</Card>
						</Col>

						<Col sm={6} lg={3}>
							<Card className="rounded-0 shadow-none m-0">
								<Card.Body className="text-center">
									<i className="ri-line-chart-line text-muted font-24"></i>
									<h3>
										{loading ? (
											<span className="spinner-border spinner-border-sm" role="status"></span>
										) : (
											<>
												<span>{completionPercentage}%</span>
												{completionPercentage > 0 && (
													<i className="mdi mdi-arrow-up text-success"></i>
												)}
											</>
										)}
									</h3>
									<p className="text-muted font-15 mb-0">Completion</p>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	);
};

export default ProjectTaskStats;
