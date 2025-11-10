import { Card, Button } from 'react-bootstrap';
import type { PortfolioItem } from '@/types/specialist';

interface PortfolioCardProps {
	item: PortfolioItem;
	isOwner: boolean;
	onEdit?: (item: PortfolioItem) => void;
	onDelete?: (item: PortfolioItem) => void;
}

const PortfolioCard = ({ item, isOwner, onEdit, onDelete }: PortfolioCardProps) => {
	return (
		<Card className="border h-100">
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
				<div className="d-flex gap-2 mt-2">
					{item.projectUrl && (
						<a
							href={item.projectUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-sm btn-primary flex-grow-1"
						>
							<i className="mdi mdi-link me-1"></i>
							View Project
						</a>
					)}
					{isOwner && (
						<>
							<Button variant="warning" size="sm" onClick={() => onEdit?.(item)}>
								<i className="mdi mdi-pencil"></i>
							</Button>
							<Button variant="danger" size="sm" onClick={() => onDelete?.(item)}>
								<i className="mdi mdi-delete"></i>
							</Button>
						</>
					)}
				</div>
			</Card.Body>
		</Card>
	);
};

export default PortfolioCard;
