
import { CustomDatePicker } from '@/components/Form';
import { useState } from 'react';

const DatePicker = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	return <CustomDatePicker value={selectedDate} onChange={(date) => setSelectedDate(date)} inline />;
};

export default DatePicker;
