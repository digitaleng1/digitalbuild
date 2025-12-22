import { Form } from 'react-bootstrap';
import { ProjectStatus } from '@/types/project';
import type { ProjectStatusFilter as ProjectStatusFilterType } from '@/types/admin-bid';

type ProjectStatusFilterProps = {
    value: ProjectStatusFilterType;
    onChange: (value: ProjectStatusFilterType) => void;
};

const ProjectStatusFilter = ({ value, onChange }: ProjectStatusFilterProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as ProjectStatusFilterType;
        onChange(newValue);
    };

    return (
        <Form.Select
            value={value}
            onChange={handleChange}
            className="form-control"
        >
            <option value="All">All Project Statuses</option>
            <option value={ProjectStatus.QuotePending}>Quote Pending</option>
            <option value={ProjectStatus.Draft}>Draft</option>
            <option value={ProjectStatus.QuoteSubmitted}>Quote Submitted</option>
            <option value={ProjectStatus.QuoteAccepted}>Quote Accepted</option>
            <option value={ProjectStatus.QuoteRejected}>Quote Rejected</option>
            <option value={ProjectStatus.InitialPaymentPending}>Initial Payment Pending</option>
            <option value={ProjectStatus.InitialPaymentComplete}>Initial Payment Complete</option>
            <option value={ProjectStatus.InProgress}>In Progress</option>
            <option value={ProjectStatus.Completed}>Completed</option>
            <option value={ProjectStatus.Cancelled}>Cancelled</option>
        </Form.Select>
    );
};

export default ProjectStatusFilter;
