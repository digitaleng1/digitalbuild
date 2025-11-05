import { Badge } from 'react-bootstrap';
import { getStatusBadgeVariant, getProjectStatusLabel } from '@/utils/projectUtils';

interface ProjectStatusBadgeProps {
    status: string;
}

const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
    return (
        <Badge bg={getStatusBadgeVariant(status)}>
            {getProjectStatusLabel(status)}
        </Badge>
    );
};

export default ProjectStatusBadge;
