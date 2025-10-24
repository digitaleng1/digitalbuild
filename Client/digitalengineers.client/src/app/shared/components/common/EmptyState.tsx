import { Card, CardBody, Button } from 'react-bootstrap';

interface EmptyStateProps {
	icon?: string;
	title: string;
	description?: string;
	actionText?: string;
	onAction?: () => void;
}

export default function EmptyState({ 
	icon = 'mdi mdi-folder-open-outline', 
	title, 
	description, 
	actionText, 
	onAction 
}: EmptyStateProps) {
	return (
		<Card>
			<CardBody>
				<div className="text-center py-5">
					<i className={`${icon} display-4 text-muted mb-3`}></i>
					<h4 className="mt-3">{title}</h4>
					{description && (
						<p className="text-muted mb-3">{description}</p>
					)}
					{actionText && onAction && (
						<Button variant="primary" onClick={onAction}>
							{actionText}
						</Button>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
