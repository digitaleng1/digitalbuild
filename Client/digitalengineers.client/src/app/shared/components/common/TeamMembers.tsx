import { Link } from 'react-router';
import { OverlayTrigger, Tooltip, Spinner, Badge } from 'react-bootstrap';
import { useMemo } from 'react';
import { useProjectSpecialists } from '@/app/shared/hooks';
import type { ProjectSpecialistDto } from '@/types/project';

type TeamMembersProps = {
	projectId?: number;
};

const TeamMembers = ({ projectId }: TeamMembersProps) => {
	const { specialists, loading, error } = useProjectSpecialists(projectId);

	const isPlaceholder = useMemo(() => {
		return specialists.length === 1 && specialists[0].specialistId === 0;
	}, [specialists]);

	if (loading) {
		return (
			<>
				<h5>Team Members:</h5>
				<div className="d-flex align-items-center">
					<Spinner animation="border" size="sm" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
					<span className="ms-2 text-muted">Loading team members...</span>
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<h5>Team Members:</h5>
				<div className="text-muted">Unable to load team members</div>
			</>
		);
	}

	if (specialists.length === 0) {
		return (
			<>
				<h5>Team Members:</h5>
				<div className="text-muted">No specialists assigned yet</div>
			</>
		);
	}

	if (isPlaceholder) {
		return (
			<>
				<h5>Team Members:</h5>
				<Badge bg="primary" className="p-2" style={{ fontSize: '0.875rem' }}>
					<i className="mdi mdi-account-group me-1"></i>
					Digital Engineers Team
				</Badge>
			</>
		);
	}

	const renderTooltipContent = (specialist: ProjectSpecialistDto) => {
		const professions = specialist.licenseTypes.map(lt => lt.professionName);
		const uniqueProfessions = [...new Set(professions)];
		const licenses = specialist.licenseTypes.map(lt => lt.licenseTypeName).join(', ');

		return (
			<div style={{ textAlign: 'left' }}>
				<div><strong>{specialist.name}</strong></div>
				{uniqueProfessions.length > 0 && (
					<div className="text-muted" style={{ fontSize: '0.85rem' }}>
						{uniqueProfessions.join(', ')}
					</div>
				)}
				{licenses && (
					<div className="text-muted" style={{ fontSize: '0.85rem' }}>
						{licenses}
					</div>
				)}
			</div>
		);
	};

	const renderSpecialistAvatar = (specialist: ProjectSpecialistDto) => {
		if (specialist.profilePictureUrl) {
			return (
				<img 
					src={specialist.profilePictureUrl} 
					className="rounded-circle img-thumbnail avatar-sm" 
					alt={specialist.name}
					style={{ width: '32px', height: '32px', objectFit: 'cover' }}
				/>
			);
		}

		const initial = specialist.name.charAt(0).toUpperCase();
		return (
			<div 
				className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
				style={{ 
					width: '32px', 
					height: '32px', 
					fontSize: '14px', 
					fontWeight: 'bold' 
				}}
			>
				{initial}
			</div>
		);
	};

	return (
		<>
			<h5>Team Members:</h5>
			{specialists.map((specialist) => (
				<OverlayTrigger
					key={specialist.specialistId}
					placement="top"
					overlay={<Tooltip>{renderTooltipContent(specialist)}</Tooltip>}
				>
					<Link to="" className="d-inline-block me-1">
						{renderSpecialistAvatar(specialist)}
					</Link>
				</OverlayTrigger>
			))}
		</>
	);
};

export default TeamMembers;
