import { Link } from 'react-router';
import { OverlayTrigger, Tooltip, Spinner, Badge, Button } from 'react-bootstrap';
import { useMemo, useState, useCallback } from 'react';
import { useProjectTeamMembers } from '@/app/shared/hooks';
import type { ProjectSpecialistDto } from '@/types/project';
import type { LicenseType, Profession } from '@/types/lookup';
import SendBidsModal from './SendBidsModal';

type TeamMembersProps = {
	projectId?: number;
	isAdmin?: boolean;
	canInviteSpecialists?: boolean;
	professions?: Profession[];
	requiredLicenseTypes?: LicenseType[];
};

const TeamMembers = ({ 
	projectId, 
	isAdmin = false, 
	canInviteSpecialists = false, 
	professions = [],
	requiredLicenseTypes = [] 
}: TeamMembersProps) => {
	const { teamMembers, loading, error, refetch } = useProjectTeamMembers(projectId);
	const [showSendBidsModal, setShowSendBidsModal] = useState(false);

	const assignedMembers = useMemo(() => {
		return teamMembers.filter(member => member.isAssigned);
	}, [teamMembers]);

	const pendingMembers = useMemo(() => {
		return teamMembers.filter(member => !member.isAssigned);
	}, [teamMembers]);

	const handleOpenSendBidsModal = useCallback(() => {
		setShowSendBidsModal(true);
	}, []);

	const handleCloseSendBidsModal = useCallback(() => {
		setShowSendBidsModal(false);
	}, []);

	const handleBidsSentSuccess = useCallback(() => {
		refetch();
	}, [refetch]);

	const shouldShowInviteButton = useMemo(() => 
		isAdmin || canInviteSpecialists,
		[isAdmin, canInviteSpecialists]
	);

	const buttonText = useMemo(() => 
		isAdmin ? 'Send Bids' : 'Invite Specialist',
		[isAdmin]
	);

	const buttonIcon = useMemo(() => 
		isAdmin ? 'mdi-send' : 'mdi-account-plus',
		[isAdmin]
	);

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

	if (teamMembers.length === 0) {
		return (
			<>
				<div className="d-flex justify-content-between align-items-center mb-2">
					<h5 className="mb-0">Team Members:</h5>
					{shouldShowInviteButton && projectId && (
						<Button
							variant="primary"
							size="sm"
							onClick={handleOpenSendBidsModal}
						>
							<i className={`mdi ${buttonIcon} me-1`}></i>
							{buttonText}
						</Button>
					)}
				</div>
				<div className="text-muted">No specialists assigned yet</div>

				{shouldShowInviteButton && projectId && (
					<SendBidsModal
						show={showSendBidsModal}
						onHide={handleCloseSendBidsModal}
						projectId={projectId}
						professions={professions}
						requiredLicenseTypes={requiredLicenseTypes}
						onSuccess={handleBidsSentSuccess}
					/>
				)}
			</>
		);
	}

	const renderTooltipContent = (member: ProjectSpecialistDto) => {
		if (member.isAnonymized) {
			// Show only profession/role for anonymized specialists
			const professions = member.licenseTypes.map(lt => lt.professionName);
			const uniqueProfessions = [...new Set(professions)];
			
			return (
				<div style={{ textAlign: 'left', maxWidth: '250px' }}>
					<div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Novobid Specialist</div>
					{member.role && (
						<div style={{ fontSize: '0.85rem', marginBottom: '4px', color: '#6c757d' }}>
							Role in Project: {member.role}
						</div>
					)}
					{uniqueProfessions.length > 0 && (
						<div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
							Professions: {uniqueProfessions.join(', ')}
						</div>
					)}
				</div>
			);
		}

		const professions = member.licenseTypes.map(lt => lt.professionName);
		const uniqueProfessions = [...new Set(professions)];
		const licenses = member.licenseTypes.map(lt => lt.licenseTypeName).join(', ');
		const statusLabel = member.isAssigned ? 'Assigned' : 'Pending Bid';
		const dateLabel = member.isAssigned ? 'Assigned' : 'Bid Sent';
		const date = new Date(member.assignedOrBidSentAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});

		return (
			<div style={{ textAlign: 'left', maxWidth: '250px' }}>
				<div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{member.name}</div>
				<div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
					<Badge bg={member.isAssigned ? 'success' : 'warning'} className="me-1">
						{statusLabel}
					</Badge>
				</div>
				{member.role && (
					<div style={{ fontSize: '0.85rem', marginBottom: '4px', color: '#6c757d', fontStyle: 'italic' }}>
						Role in Project: {member.role}
					</div>
				)}
				{uniqueProfessions.length > 0 && (
					<div style={{ fontSize: '0.85rem', marginBottom: '2px', color: '#6c757d' }}>
						Professions: {uniqueProfessions.join(', ')}
					</div>
				)}
				{licenses && (
					<div style={{ fontSize: '0.85rem', marginBottom: '4px', color: '#6c757d' }}>
						Licenses: {licenses}
					</div>
				)}
				<div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#6c757d' }}>
					{dateLabel}: {date}
				</div>
			</div>
		);
	};

	const renderMemberAvatar = (member: ProjectSpecialistDto) => {
		if (member.isAnonymized) {
			// Show "DE" avatar for anonymized specialists
			return (
				<div 
					className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
					style={{ 
						width: '32px', 
						height: '32px', 
						fontSize: '12px', 
						fontWeight: 'bold'
					}}
				>
					DE
				</div>
			);
		}

		const avatarClass = member.isAssigned 
			? 'rounded-circle img-thumbnail avatar-sm' 
			: 'rounded-circle img-thumbnail avatar-sm border-warning';
		
		const avatarStyle = member.isAssigned 
			? { width: '32px', height: '32px', objectFit: 'cover' as const }
			: { width: '32px', height: '32px', objectFit: 'cover' as const, opacity: 0.7 };

		if (member.profilePictureUrl) {
			return (
				<img 
					src={member.profilePictureUrl} 
					className={avatarClass}
					alt={member.name}
					style={avatarStyle}
				/>
			);
		}

		const initial = member.name.charAt(0).toUpperCase();
		const bgClass = member.isAssigned ? 'bg-primary' : 'bg-warning';
		
		return (
			<div 
				className={`rounded-circle d-flex align-items-center justify-content-center ${bgClass} text-white`}
				style={{ 
					width: '32px', 
					height: '32px', 
					fontSize: '14px', 
					fontWeight: 'bold',
					opacity: member.isAssigned ? 1 : 0.7
				}}
			>
				{initial}
			</div>
		);
	};

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-2">
				<h5 className="mb-0">Team Members:</h5>
				{shouldShowInviteButton && projectId && (
					<Button
						variant="primary"
						size="sm"
						onClick={handleOpenSendBidsModal}
					>
						<i className={`mdi ${buttonIcon} me-1`}></i>
						{buttonText}
					</Button>
				)}
			</div>
			
			{assignedMembers.length > 0 && (
				<div className="mb-2">
					{assignedMembers.map((member) => (
						<OverlayTrigger
							key={`assigned-${member.specialistId}`}
							placement="top"
							overlay={<Tooltip>{renderTooltipContent(member)}</Tooltip>}
						>
							<Link to="" className="d-inline-block me-1">
								{renderMemberAvatar(member)}
							</Link>
						</OverlayTrigger>
					))}
				</div>
			)}
			
			{pendingMembers.length > 0 && (
				<div>
					<small className="text-muted d-block mb-1">
						<i className="mdi mdi-clock-outline me-1"></i>
						Pending Bids:
					</small>
					{pendingMembers.map((member) => (
						<OverlayTrigger
							key={`pending-${member.specialistId}`}
							placement="top"
							overlay={<Tooltip>{renderTooltipContent(member)}</Tooltip>}
						>
							<Link to="" className="d-inline-block me-1">
								{renderMemberAvatar(member)}
							</Link>
						</OverlayTrigger>
					))}
				</div>
			)}

			{shouldShowInviteButton && projectId && (
				<SendBidsModal
					show={showSendBidsModal}
					onHide={handleCloseSendBidsModal}
					projectId={projectId}
					professions={professions}
					requiredLicenseTypes={requiredLicenseTypes}
					onSuccess={handleBidsSentSuccess}
				/>
			)}
		</>
	);
};

export default TeamMembers;
