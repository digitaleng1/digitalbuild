import { useState } from 'react';
import { Card, CardBody, Button } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { PortfolioItem } from '@/types/specialist';
import AddPortfolioModal from './AddPortfolioModal';
import { PortfolioCarousel } from '@/app/shared/components/portfolio';

interface PortfolioSectionProps {
	portfolio: PortfolioItem[];
	specialistId: number;
	isEditMode: boolean;
	onRefresh: () => void;
}

const PortfolioSection = ({ portfolio, specialistId, isEditMode, onRefresh }: PortfolioSectionProps) => {
	const [showAddModal, setShowAddModal] = useState(false);

	return (
		<>
			<Card>
				<CardBody>
					<CardTitle
						containerClass="d-flex align-items-center justify-content-between mb-3"
						title="Portfolio"
						icon="mdi mdi-folder-multiple-image"
					>
						{isEditMode && (
							<Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
								<i className="mdi mdi-plus me-1"></i>
								Add Item
							</Button>
						)}
					</CardTitle>

					<PortfolioCarousel
						portfolio={portfolio}
						isOwner={isEditMode}
						specialistId={specialistId}
						onRefresh={onRefresh}
					/>
				</CardBody>
			</Card>

			{isEditMode && (
				<AddPortfolioModal
					show={showAddModal}
					specialistId={specialistId}
					onHide={() => setShowAddModal(false)}
					onSuccess={onRefresh}
				/>
			)}
		</>
	);
};

export default PortfolioSection;
