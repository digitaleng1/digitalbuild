import { Card } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { UserProfile } from '@/types/user-profile';

interface AccountInfoProps {
	profile: UserProfile;
}

const AccountInfo = ({ profile }: AccountInfoProps) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<Card>
			<Card.Body>
				<CardTitle
					containerClass="mb-3"
					title="Account Information"
					icon="mdi mdi-shield-account"
				/>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Email</h6>
					<p className="mb-0">
						<i className="mdi mdi-email me-1"></i>
						{profile.email}
					</p>
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Roles</h6>
					<div className="d-flex flex-wrap gap-2">
						{profile.roles.map((role) => (
							<span 
								key={role} 
								className={`badge ${
									role === 'SuperAdmin' ? 'bg-danger' : 
									role === 'Admin' ? 'bg-primary' : 
									'bg-secondary'
								}`}
							>
								{role}
							</span>
						))}
					</div>
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Member Since</h6>
					<p className="mb-0">
						<i className="mdi mdi-calendar me-1"></i>
						{formatDate(profile.createdAt)}
					</p>
				</div>

				<div className="mb-0">
					<h6 className="text-muted mb-1">Last Active</h6>
					<p className="mb-0">
						<i className="mdi mdi-clock-outline me-1"></i>
						{profile.lastActive ? formatDate(profile.lastActive) : 'Never'}
					</p>
				</div>
			</Card.Body>
		</Card>
	);
};

export default AccountInfo;
