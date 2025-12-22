import { useState, useRef } from 'react';
import { Badge, Overlay, Popover, ListGroup } from 'react-bootstrap';
import type { ProfessionTypeDetailDto } from '@/types/lookup';

interface ProfessionTypeBadgeProps {
	professionType: ProfessionTypeDetailDto;
	onRemove: () => void;
}

const ProfessionTypeBadge = ({ professionType, onRemove }: ProfessionTypeBadgeProps) => {
	const [showPopover, setShowPopover] = useState(false);
	const target = useRef(null);

	const handleBadgeClick = () => {
		if (professionType.licenseRequirements.length > 0) {
			setShowPopover(!showPopover);
		}
	};

	return (
		<>
			<Badge
				ref={target}
				bg="primary"
				className="me-2 mb-2 d-inline-flex align-items-center"
				style={{ 
					fontSize: '0.875rem', 
					padding: '0.5rem 0.75rem',
					cursor: professionType.licenseRequirements.length > 0 ? 'pointer' : 'default'
				}}
				onClick={handleBadgeClick}
			>
				<span>{professionType.name}</span>
				{professionType.licenseRequirements.length > 0 && (
					<span className="ms-1 opacity-75">
						({professionType.licenseRequirements.length})
					</span>
				)}
				<button
					type="button"
					className="btn-close btn-close-white ms-2"
					style={{ fontSize: '0.625rem' }}
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					aria-label="Remove"
				/>
			</Badge>

			<Overlay
				target={target.current}
				show={showPopover}
				placement="bottom"
				rootClose
				onHide={() => setShowPopover(false)}
			>
				<Popover id={`popover-${professionType.id}`}>
					<Popover.Header as="h3">
						{professionType.name} - Licenses
					</Popover.Header>
					<Popover.Body className="p-0">
						<ListGroup variant="flush">
							{professionType.licenseRequirements.map((lr) => (
								<ListGroup.Item 
									key={lr.licenseTypeId}
									className="py-2"
								>
									<div className="d-flex align-items-center justify-content-between">
										<div>
											<i className="mdi mdi-certificate text-primary me-2" />
											<span className="small">{lr.licenseTypeName}</span>
										</div>
										<div>
											<Badge 
												bg={lr.isRequired ? 'danger' : 'info'}
												className="me-1"
											>
												{lr.isRequired ? 'Required' : 'Optional'}
											</Badge>
											{lr.isStateSpecific && (
												<Badge bg="warning">State</Badge>
											)}
										</div>
									</div>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Popover.Body>
				</Popover>
			</Overlay>
		</>
	);
};

export default ProfessionTypeBadge;
