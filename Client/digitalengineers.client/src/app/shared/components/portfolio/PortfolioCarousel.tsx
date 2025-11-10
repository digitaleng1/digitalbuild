import { useState } from 'react';
import { Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import type { PortfolioItem } from '@/types/specialist';
import PortfolioCard from './PortfolioCard';
import EditPortfolioModal from './EditPortfolioModal';
import portfolioService from '@/services/portfolioService';
import { useToast } from '@/contexts/ToastContext';

interface PortfolioCarouselProps {
	portfolio: PortfolioItem[];
	isOwner: boolean;
	specialistId?: number;
	onRefresh?: () => void;
}

const PortfolioCarousel = ({ portfolio, isOwner, specialistId, onRefresh }: PortfolioCarouselProps) => {
	const { showSuccess, showError } = useToast();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<'left' | 'right'>('right');
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleEdit = (item: PortfolioItem) => {
		setSelectedItem(item);
		setShowEditModal(true);
	};

	const handleDelete = (item: PortfolioItem) => {
		setSelectedItem(item);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedItem) return;

		setDeleting(true);
		try {
			await portfolioService.deletePortfolioItem(selectedItem.id);
			showSuccess('Success', 'Portfolio item deleted successfully');
			setShowDeleteModal(false);
			setSelectedItem(null);
			
			if (currentIndex >= portfolio.length - 1) {
				setCurrentIndex(0);
			}
			
			onRefresh?.();
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to delete portfolio item');
		} finally {
			setDeleting(false);
		}
	};

	const handleEditSuccess = () => {
		onRefresh?.();
	};

	const handlePrev = () => {
		setDirection('left');
		setCurrentIndex((prev) => (prev === 0 ? portfolio.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setDirection('right');
		setCurrentIndex((prev) => (prev === portfolio.length - 1 ? 0 : prev + 1));
	};

	if (!portfolio || portfolio.length === 0) {
		return (
			<Alert variant="info" className="mb-0">
				<i className="mdi mdi-information-outline me-2"></i>
				{isOwner ? 'No portfolio items yet. Click "Add Item" to showcase your work.' : 'No portfolio items to display.'}
			</Alert>
		);
	}

	const getColumnSize = (totalItems: number): number => {
		if (totalItems === 1) return 12;
		if (totalItems === 2) return 6;
		return 4;
	};

	const colSize = getColumnSize(portfolio.length);
	const visibleItems = portfolio.slice(currentIndex, currentIndex + 3);
	
	// If less than 3 items visible, add items from the beginning (circular)
	if (visibleItems.length < 3 && portfolio.length > 1) {
		const remaining = 3 - visibleItems.length;
		visibleItems.push(...portfolio.slice(0, remaining));
	}

	return (
		<>
			<div className="position-relative">
				<div className="overflow-hidden">
					<Row 
						className={`justify-content-center portfolio-carousel-slide portfolio-carousel-slide-${direction}`}
						key={currentIndex}
					>
						{visibleItems.map((item, index) => (
							<Col md={12} lg={colSize} key={`${item.id}-${index}`} className="mb-3 mb-lg-0">
								<PortfolioCard
									item={item}
									isOwner={isOwner}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							</Col>
						))}
					</Row>
				</div>

				{portfolio.length > 3 && (
					<>
						<div
							className="position-absolute top-50 start-0 translate-middle-y rounded-circle"
							style={{ zIndex: 10, marginLeft: '-45px', width: '40px', height: '40px' }}
							onClick={handlePrev}
						>
							<i className="mdi mdi-chevron-left display-3"></i>
						</div>

						<div
							className="position-absolute top-50 end-0 translate-middle-y rounded-circle"
							style={{ zIndex: 10, marginRight: '-20px', width: '40px', height: '40px' }}
							onClick={handleNext}
						>
							<i className="mdi mdi-chevron-right display-3"></i>
						</div>
					</>
				)}

				{portfolio.length > 1 && (
					<div className="d-flex justify-content-center mt-3 gap-2">
						{portfolio.map((_, index) => (
							<button
								key={index}
								className={`btn btn-sm rounded-circle ${
									index === currentIndex ? 'btn-primary' : 'btn-outline-secondary'
								}`}
								style={{ width: '10px', height: '10px', padding: 0 }}
								onClick={() => {
									setDirection(index > currentIndex ? 'right' : 'left');
									setCurrentIndex(index);
								}}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>

			<style>{`
				@keyframes slideInFromRight {
					from {
						opacity: 0;
						transform: translateX(50px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes slideInFromLeft {
					from {
						opacity: 0;
						transform: translateX(-50px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.portfolio-carousel-slide {
					animation-duration: 0.4s;
					animation-timing-function: ease-out;
					animation-fill-mode: both;
				}

				.portfolio-carousel-slide-right {
					animation-name: slideInFromRight;
				}

				.portfolio-carousel-slide-left {
					animation-name: slideInFromLeft;
				}
			`}</style>

			{selectedItem && (
				<>
					<EditPortfolioModal
						show={showEditModal}
						item={selectedItem}
						onHide={() => setShowEditModal(false)}
						onSuccess={handleEditSuccess}
					/>

					<Modal show={showDeleteModal} onHide={() => !deleting && setShowDeleteModal(false)} centered>
						<Modal.Header closeButton={!deleting}>
							<Modal.Title>Delete Portfolio Item</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>
								Are you sure you want to delete <strong>"{selectedItem.title}"</strong>?
							</p>
							<Alert variant="warning" className="mb-0">
								<i className="mdi mdi-alert-outline me-2"></i>
								This action cannot be undone.
							</Alert>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
								Cancel
							</Button>
							<Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
								{deleting ? (
									<>
										<span className="spinner-border spinner-border-sm me-2"></span>
										Deleting...
									</>
								) : (
									<>
										<i className="mdi mdi-delete me-1"></i>
										Delete
									</>
								)}
							</Button>
						</Modal.Footer>
					</Modal>
				</>
			)}
		</>
	);
};

export default PortfolioCarousel;
