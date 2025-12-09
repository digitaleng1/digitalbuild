import { useState, useMemo } from 'react';
import { Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { ProjectCard } from './';
import { LoadingSpinner, EmptyState } from '../common';
import { useSpecialistProjects } from '../../hooks';

interface SpecialistProjectListProps {
	specialistId: number;
	basePath?: string;
}

export default function SpecialistProjectList({
	specialistId,
	basePath = '/specialist/projects'
}: SpecialistProjectListProps) {
	const { projects, loading, error, refetch } = useSpecialistProjects(specialistId);
	const [statusFilter, setStatusFilter] = useState<string>('All');

	const filteredProjects = useMemo(() => {
		if (!projects) return [];
		
		if (statusFilter === 'All') return projects;
		
		return projects.filter(p => p.status === statusFilter);
	}, [projects, statusFilter]);

	return (
		<>
			<Row className="mb-2">
				<Col sm={12}>
					<div className="text-sm-end">
						<div className="btn-group mb-3">
							<Button 
								variant={statusFilter === 'All' ? 'primary' : 'light'}
								onClick={() => setStatusFilter('All')}
							>
								All
							</Button>
						</div>
						<ButtonGroup className="mb-3 ms-1">
							<Button 
								variant={statusFilter === 'Active' ? 'primary' : 'light'}
								onClick={() => setStatusFilter('Active')}
							>
								Active
							</Button>
							<Button 
								variant={statusFilter === 'Completed' ? 'primary' : 'light'}
								onClick={() => setStatusFilter('Completed')}
							>
								Completed
							</Button>
						</ButtonGroup>

						<ButtonGroup className="mb-3 ms-2 d-none d-sm-inline-block">
							<Button variant="secondary" onClick={refetch}>
								<i className="ri-refresh-line"></i>
							</Button>
						</ButtonGroup>
					</div>
				</Col>
			</Row>

			{/* Loading State */}
			{loading && (
				<LoadingSpinner 
					size="lg" 
					text="Loading projects..." 
					fullScreen 
				/>
			)}

			{/* Error State */}
			{!loading && error && (
				<Alert variant="danger" dismissible onClose={refetch}>
					<Alert.Heading>Error Loading Projects</Alert.Heading>
					<p>{error}</p>
					<Button variant="outline-danger" size="sm" onClick={refetch}>
						<i className="mdi mdi-refresh me-1"></i>
						Try Again
					</Button>
				</Alert>
			)}

			{/* Empty State */}
			{!loading && !error && (!filteredProjects || filteredProjects.length === 0) && (
				<EmptyState
					icon="mdi mdi-briefcase-outline"
					title={statusFilter !== 'All' ? 'No Projects Found' : 'No Assigned Projects'}
					description={statusFilter !== 'All' 
						? 'Try adjusting your filters' 
						: "You don't have any assigned projects yet. Projects will appear here once clients assign you to them."}
				/>
			)}

			{/* Projects Grid */}
			{!loading && !error && filteredProjects && filteredProjects.length > 0 && (
				<Row>
					{filteredProjects.map((project) => (
						<Col md={6} xxl={3} key={project.id}>
							<ProjectCard 
								project={project}
							/>
						</Col>
					))}
				</Row>
			)}
		</>
	);
}
