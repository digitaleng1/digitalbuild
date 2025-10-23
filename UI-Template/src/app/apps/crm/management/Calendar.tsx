
import CardTitle from '@/components/CardTitle';
import { CustomDatePicker } from '@/components/Form';
import { useState } from 'react';
import { Card, CardBody } from 'react-bootstrap';

const Calendar = () => {
	const [date, setDate] = useState<Date>(new Date());

	return (
		<Card>
			<CardBody className="pb-1">
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between"
					title="Calendar"
					menuItems={[{ label: 'Today' }, { label: 'Yesterday' }, { label: 'Last Week' }, { label: 'Last Month' }]}
				/>
			</CardBody>
			<CardBody className="calendar-widget px-2 pb-2 pt-0">
				<CustomDatePicker value={date} onChange={(date) => setDate(date)} inline />
			</CardBody>
		</Card>
	);
};

export default Calendar;
