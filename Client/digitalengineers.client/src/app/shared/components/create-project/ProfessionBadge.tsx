import { Badge, Button } from 'react-bootstrap';
import type { Profession, LicenseType } from '@/types/dictionary';

interface ProfessionBadgeProps {
	profession: Profession;
	selectedLicenseTypes: LicenseType[];
	onClick: () => void;
	onRemove?: () => void;
}

const ProfessionBadge = ({ profession, selectedLicenseTypes, onClick, onRemove }: ProfessionBadgeProps) => {
	const count = selectedLicenseTypes.length;

	return (
		<Badge
			bg="primary"
			className="me-2 mb-2 d-inline-flex align-items-center"
			style={{ cursor: 'pointer', fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
		>
			<span onClick={onClick} className="me-2">
				{profession.name} {count > 0 && `(${count})`}
			</span>
			{onRemove && (
				<Button
					size="sm"
					variant="link"
					className="p-0 text-white"
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
				>
					<i className="mdi mdi-close"></i>
				</Button>
			)}
		</Badge>
	);
};

export default ProfessionBadge;
