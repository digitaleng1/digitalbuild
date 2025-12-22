import { Badge } from 'react-bootstrap';
import type { Profession } from '@/types/lookup';

interface ProfessionBadgeProps {
	profession: Profession;
	selectedCount: number;
	onClick: () => void;
}

const ProfessionBadge = ({ profession, selectedCount, onClick }: ProfessionBadgeProps) => {
	return (
		<Badge
			bg={selectedCount > 0 ? 'primary' : 'secondary'}
			className="me-2 mb-2 d-inline-flex align-items-center"
			style={{ cursor: 'pointer', fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
			onClick={onClick}
		>
			<span className="fw-bold">{profession.name}</span>
			{profession.code && (
				<span className="ms-1 opacity-75">[{profession.code}]</span>
			)}
			{selectedCount > 0 && (
				<span className="ms-2 badge bg-light text-dark">{selectedCount}</span>
			)}
		</Badge>
	);
};

export default ProfessionBadge;
