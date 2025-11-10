import { Card, CardBody, Badge } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { LicenseType } from '@/types/project';

interface LicensesCardProps {
	licenses: LicenseType[];
}

const LicensesCard = ({ licenses }: LicensesCardProps) => {
	if (!licenses || licenses.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Licenses & Certifications"
					icon="mdi mdi-certificate"
				/>

				<div className="d-flex flex-wrap gap-2">
					{licenses.map((license) => (
						<Badge key={license.id} bg="primary" className="p-2">
							<i className="mdi mdi-check-circle me-1"></i>
							{license.name}
						</Badge>
					))}
				</div>
			</CardBody>
		</Card>
	);
};

export default LicensesCard;
