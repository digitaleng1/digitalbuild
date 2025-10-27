import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

export interface ProjectFiltersData {
	status: string;
	search: string;
}

interface ProjectFiltersProps {
	onFilterChange: (filters: ProjectFiltersData) => void;
}

const ProjectFilters = ({ onFilterChange }: ProjectFiltersProps) => {
	const [status, setStatus] = useState<string>('All');
	const [search, setSearch] = useState<string>('');

	const handleApplyFilters = () => {
		onFilterChange({ status, search });
	};

	const handleClearFilters = () => {
		setStatus('All');
		setSearch('');
		onFilterChange({ status: 'All', search: '' });
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleApplyFilters();
		}
	};

	return (
		<Card className="mb-3">
			<Card.Body>
				<Row className="g-3">
					<Col md={4}>
						<Form.Group>
							<Form.Label>Status</Form.Label>
							<Form.Select 
								value={status} 
								onChange={(e) => setStatus(e.target.value)}
							>
								<option value="All">All</option>
								<option value="New">New</option>
								<option value="Active">Active</option>
								<option value="InProgress">In Progress</option>
								<option value="Completed">Completed</option>
								<option value="Cancelled">Cancelled</option>
							</Form.Select>
						</Form.Group>
					</Col>
					<Col md={6}>
						<Form.Group>
							<Form.Label>Search by Project or Client Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter project or client name..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								onKeyPress={handleKeyPress}
							/>
						</Form.Group>
					</Col>
					<Col md={2} className="d-flex align-items-end">
						<div className="d-flex gap-2 w-100">
							<Button 
								variant="primary" 
								onClick={handleApplyFilters}
								className="flex-grow-1"
							>
								Apply
							</Button>
							<Button 
								variant="secondary" 
								onClick={handleClearFilters}
							>
								Clear
							</Button>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default ProjectFilters;
export type { ProjectFiltersData };
