
import { CustomDatePicker } from '@/components/Form';
import { useState } from 'react';

const DatePicker = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	return (
		<div className="input-group">
			<CustomDatePicker
				value={selectedDate}
				inputClass="form-control-light"
				onChange={(date) => {
					setSelectedDate(date);
				}}
			/>
		</div>
	);
};

export default DatePicker;
