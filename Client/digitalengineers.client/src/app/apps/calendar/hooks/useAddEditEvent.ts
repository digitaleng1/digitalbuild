import { useState } from 'react';
import * as yup from 'yup';
import type{ EventInput } from '@fullcalendar/core';
import type { Event } from '../types';

export default function useAddEditEvent(
	eventData: EventInput | undefined,
	isEditable: boolean,
	onUpdateEvent: (value: Event) => void,
	onAddEvent: (value: Event) => void
) {
	// event state
	const [event] = useState<Event>({
		title: eventData?.title || '',
		className: eventData?.className || '',
	});

	// /*
	//  * form validation schema
	//  */
	const schema = yup.object().shape({
		title: yup.string().required('Please enter event name'),
		className: yup.string().required('Please select category'),
	});

	/*
	 * handle form submission
	 */
	const onSubmitEvent = (data: Event) => {
		isEditable ? onUpdateEvent(data) : onAddEvent(data);
	};

	return {
		event,
		schema,
		onSubmitEvent,
	};
}
