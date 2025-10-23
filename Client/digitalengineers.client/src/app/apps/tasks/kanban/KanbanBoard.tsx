
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useKanban } from '../hooks';
import { kanbanTaskSchema } from '../hooks/useKanban';
import TaskItem from './Task';
import { CustomDatePicker, Form, SelectInput, TextAreaInput, TextInput } from '@/components/Form';

const KanbanBoard = () => {
	const { state, toggleNewTaskModal, onDragEnd, handleDateChange, handleNewTask } = useKanban();

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="board">
					{/* todo */}
					<Droppable droppableId="todoTasks">
						{(provided) => (
							<div className="tasks" ref={provided.innerRef}>
								<h5 className="mt-0 task-header">TODO ({state.todoTasks.length})</h5>

								{state.todoTasks.length === 0 && <p className="text-center text-muted pt-2 mb-0">No Tasks</p>}

								{state.todoTasks.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id + ''} index={index}>
										{(provided) => (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<TaskItem task={item} />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>

					{/* in progress */}
					<Droppable droppableId="inprogressTasks">
						{(provided) => (
							<div ref={provided.innerRef} className="tasks">
								<h5 className="mt-0 task-header text-uppercase">In Progress ({state.inprogressTasks.length})</h5>
								{state.inprogressTasks.length === 0 && <p className="text-center text-muted pt-2 mb-0">No Tasks</p>}

								{state.inprogressTasks.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id + ''} index={index}>
										{(provided) => (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<TaskItem task={item} />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>

					{/* review */}
					<Droppable droppableId="reviewTasks">
						{(provided) => (
							<div ref={provided.innerRef} className="tasks">
								<h5 className="mt-0 task-header text-uppercase">Review ({state.reviewTasks.length})</h5>
								{state.reviewTasks.length === 0 && <p className="text-center text-muted pt-2 mb-0">No Tasks</p>}

								{state.reviewTasks.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id + ''} index={index}>
										{(provided) => (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<TaskItem task={item} />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>

					{/* done */}
					<Droppable droppableId="doneTasks">
						{(provided) => (
							<div ref={provided.innerRef} className="tasks">
								<h5 className="mt-0 task-header text-uppercase">Done ({state.doneTasks.length})</h5>
								{state.doneTasks.length === 0 && <p className="text-center text-muted pt-2 mb-0">No Tasks</p>}

								{state.doneTasks.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id + ''} index={index}>
										{(provided) => (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<TaskItem task={item} />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
			</DragDropContext>

			{/* new task model */}
			{state.newTask && (
				<Modal show={state.newTaskModal} onHide={toggleNewTaskModal} size="lg" centered>
					<Modal.Header closeButton>
						<h4 className="modal-title">Create New Task</h4>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={handleNewTask} className="p-2" schema={kanbanTaskSchema}>
							<SelectInput name="project" label="Project" containerClass="mb-3" className="form-select form-control-light" key="project">
								<option value="-1">Select</option>
								<option>Hyper</option>
								<option>CRM</option>
								<option>iOS App</option>
							</SelectInput>

							<Row>
								<Col md={8}>
									<TextInput
										name="title"
										label="Title"
										placeholder="Enter title"
										type="text"
										containerClass="mb-3"
										className="form-control form-control-light"
										key="title"
									/>
								</Col>
								<Col md={4}>
									<SelectInput name="priority" label="Priority" containerClass="mb-3" className="form-select form-control-light" key="priority">
										<option value={-1}>Select</option>
										<option value="Low">Low</option>
										<option value="Medium">Medium</option>
										<option value="High">High</option>
									</SelectInput>
								</Col>
							</Row>

							<TextAreaInput
								name="description"
								label="Description"
								containerClass="mb-3"
								className="form-control form-control-light"
								rows={3}
								key="description"
							/>

							<Row>
								<Col md={6}>
									<SelectInput name="user" label="Assign To" containerClass="mb-3" className="form-select form-control-light" key="user">
										<option>Select</option>
										<option>Coderthemes</option>
										<option>Robert Carlile</option>
										<option>Louis Allen</option>
										<option>Sean White</option>
										<option>Riley Steele</option>
										<option>Zak Turnbull</option>
									</SelectInput>
								</Col>
								<Col md={6}>
									<div className="form-group">
										<label className="form-label">Due Date</label> <br />
										<CustomDatePicker
											hideAddon={true}
											dateFormat="yyyy-MM-dd"
											value={state.newTask.dueDate}
											onChange={(date) => {
												handleDateChange(date);
											}}
										/>
									</div>
								</Col>
							</Row>

							<div className="text-end">
								<Button variant="light" type="button" className="me-1" onClick={toggleNewTaskModal}>
									Cancel
								</Button>
								<Button variant="primary" type="submit">
									Create
								</Button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			)}
		</>
	);
};

export default KanbanBoard;
