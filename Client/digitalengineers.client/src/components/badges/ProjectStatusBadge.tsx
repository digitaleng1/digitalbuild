import { Badge } from 'react-bootstrap';
import type { ProjectStatus } from '@/types/project';

interface ProjectStatusBadgeProps {
    status: string;
}

const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
    const getBadgeVariant = () => {
        switch (status) {
            case 'New':
                return 'info';
            case 'Draft':
                return 'secondary';
            case 'Published':
                return 'primary';
            case 'InProgress':
                return 'warning';
            case 'Completed':
                return 'success';
            case 'Cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'InProgress':
                return 'In Progress';
            default:
                return status;
        }
    };

    return (
        <Badge bg={getBadgeVariant()}>
            {getStatusLabel()}
        </Badge>
    );
};

export default ProjectStatusBadge;
