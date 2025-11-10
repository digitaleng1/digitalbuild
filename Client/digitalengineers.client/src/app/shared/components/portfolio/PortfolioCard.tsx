import { Card } from 'react-bootstrap';
import type { PortfolioItem } from '@/types/specialist';

interface PortfolioCardProps {
	item: PortfolioItem;
	isOwner: boolean;
	onEdit?: (item: PortfolioItem) => void;
	onDelete?: (item: PortfolioItem) => void;
}

const PortfolioCard = ({ item, isOwner, onEdit, onDelete }: PortfolioCardProps) => {
	return (
		<Card className="border h-100 position-relative">
			{/* Action Icons - top right corner over image */}
			<div className="position-absolute top-0 end-0 d-flex gap-2 p-2" style={{ zIndex: 10 }}>
				{item.projectUrl && (
					<a
						href={item.projectUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-decoration-none"
						title="View Project"
					>
						<i className="mdi mdi-link-variant text-primary" style={{ fontSize: '1.3rem' }}></i>
					</a>
				)}
				{isOwner && (
					<>
						<i 
							className="mdi mdi-pencil cursor-pointer"
							style={{ fontSize: '1.3rem' }}
							onClick={() => onEdit?.(item)}
							title="Edit"
						></i>
						<i 
							className="mdi mdi-delete cursor-pointer"
							style={{ fontSize: '1.3rem' }}
							onClick={() => onDelete?.(item)}
							title="Delete"
						></i>
					</>
				)}
			</div>

			{item.thumbnailUrl && (
				<Card.Img
					variant="top"
					src={item.thumbnailUrl}
					style={{ height: '200px', objectFit: 'cover' }}
					alt={item.title}
				/>
			)}
			<Card.Body className="d-flex flex-column">
				<div className="flex-grow-1">
					<Card.Title as="h5" className="mb-1">
						{item.title}
					</Card.Title>
					<Card.Text className="text-muted small mb-2">
						{item.description.length > 100
							? `${item.description.substring(0, 100)}...`
							: item.description}
					</Card.Text>
				</div>
			</Card.Body>
		</Card>
	);
};

export default PortfolioCard;
