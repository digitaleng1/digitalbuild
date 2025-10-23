
import { Row, Col, Card, Button, CardBody } from 'react-bootstrap';
import FullCalendarWidget from './FullCalendarWidget';
import SidePanel from './SidePanel';
import { useCalendar } from './hooks';
import AddEditEvent from './AddEditEvent';
import '@fullcalendar/react';

const CalendarPage = () => {
	const {
		isOpen,
		onOpenModal,
		onCloseModal,
		isEditable,
		eventData,
		events,
		onDateClick,
		onEventClick,
		onDrop,
		onEventDrop,
		onUpdateEvent,
		onRemoveEvent,
		onAddEvent,
	} = useCalendar();
	return (
		<>
			<Card>
				<CardBody>
					<Row>
						<Col xl={3}>
							<div className="d-grid">
								{/* add events */}
								<Button className="btn btn-lg font-16 btn-danger" id="btn-new-event" onClick={onOpenModal}>
									<i className="mdi mdi-plus-circle-outline"></i> Create New Event
								</Button>
							</div>

							<SidePanel />
						</Col>
						<Col xl={9}>
							{/* fullcalendar control */}
							<FullCalendarWidget onDateClick={onDateClick} onEventClick={onEventClick} onDrop={onDrop} onEventDrop={onEventDrop} events={events} />
						</Col>
					</Row>
				</CardBody>
			</Card>

			{/* add new event modal */}
			{isOpen ? (
				<AddEditEvent
					isOpen={isOpen}
					onClose={onCloseModal}
					isEditable={isEditable}
					eventData={eventData}
					onUpdateEvent={onUpdateEvent}
					onRemoveEvent={onRemoveEvent}
					onAddEvent={onAddEvent}
				/>
			) : null}
		</>
	);
};

export default CalendarPage;
