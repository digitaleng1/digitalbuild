
import { CustomDatePicker } from '@/components/Form';
import { useState } from 'react';

const DatePicker = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	return (
		<CustomDatePicker
			value={selectedDate}
			inputClass="form-control-light"
			onChange={(date) => {
				setSelectedDate(date);
			}}
		/>
	);
};

export default DatePicker;
