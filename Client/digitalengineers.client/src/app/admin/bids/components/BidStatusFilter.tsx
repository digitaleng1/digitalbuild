import { Form } from 'react-bootstrap';
import { BidRequestStatus } from '@/types/bid';
import type { BidStatusFilter as BidStatusFilterType } from '@/types/admin-bid';

type BidStatusFilterProps = {
    value: BidStatusFilterType;
    onChange: (value: BidStatusFilterType) => void;
};

const BidStatusFilter = ({ value, onChange }: BidStatusFilterProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as BidStatusFilterType;
        onChange(newValue);
    };

    return (
        <Form.Select
            value={value}
            onChange={handleChange}
            className="form-control"
        >
            <option value="All">All Bid Statuses</option>
            <option value={BidRequestStatus.Pending}>Has Pending Bids</option>
            <option value={BidRequestStatus.Responded}>Has Responded Bids</option>
            <option value={BidRequestStatus.Accepted}>Has Accepted Bids</option>
            <option value={BidRequestStatus.Rejected}>Has Rejected Bids</option>
        </Form.Select>
    );
};

export default BidStatusFilter;
