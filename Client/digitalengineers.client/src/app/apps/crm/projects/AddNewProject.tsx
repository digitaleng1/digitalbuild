
import { Form, SelectInput, TextAreaInput, TextInput } from '@/components/Form';
import { useToggle } from '@/hooks';
import {Link} from "react-router";
import { Button, Card, CardBody, Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';
import * as yup from 'yup';
const AddNewProject = () => {
	const [isopen, , show, hide] = useToggle();

	const projectSchema = yup.object({
		email: yup.string().email('Please enter valid email').required('Please enter email'),
		password: yup.string().required('Please enter password'),
	});

	return (
		<>
			<Card className="mb-0 h-100">
				<CardBody>
					<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
						<Link to="" onClick={show} className="text-center text-muted p-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
							<i className="mdi mdi-plus h3 my-0"></i>
							<h4 className="font-16 mt-1 mb-0 d-block">Add New Project</h4>
						</Link>
					</div>
				</CardBody>
			</Card>

			{/* add new project */}
			<Modal show={isopen} onHide={hide}>
				<Modal.Header closeButton>
					<Modal.Title as="h5">Add New Project</Modal.Title>
				</Modal.Header>
				<Form onSubmit={() => {}} schema={projectSchema}>
					<Modal.Body>
						<TextInput type="text" label="Project Name" name="projectName" placeholder="Add project name..." containerClass="mb-3" />

						<SelectInput name="select" label="Add Task" containerClass="mb-3">
							<option>Add a task...</option>
							<option value="1">Landing Page</option>
							<option value="2">Admin Dashboards</option>
							<option value="3">Admin Pages</option>
							<option value="4">UX/UI Design</option>
							<option value="5">Client Work</option>
							<option value="6">Other Work</option>
						</SelectInput>

						<div className="mb-3">
							<label htmlFor="AssignTask" className="form-label">
								Assign Task
							</label>
							<ReactSelect
								placeholder="Choose..."
								isMulti={true}
								options={[
									{
										label: 'UX Designer',
										options: [
											{ value: 'AD', label: 'Andrea' },
											{ value: 'DL', label: 'Danielle' },
											{ value: 'JH', label: 'John' },
										],
									},
									{
										label: 'Developer',
										options: [
											{ value: 'ST', label: 'Steven' },
											{ value: 'MC', label: 'Michael' },
										],
									},
									{
										label: 'UX Designer',
										options: [
											{ value: 'SR', label: 'Sharon' },
											{ value: 'TM', label: 'Timothy' },
											{ value: 'FD', label: 'Frederick' },
											{ value: 'HN', label: 'Henry' },
										],
									},
								]}
								className="react-select"
							/>
						</div>

						<TextAreaInput label="Description" name="description" rows={4} />
					</Modal.Body>
					<Modal.Footer>
						<Button variant="light" onClick={hide}>
							Close
						</Button>
						<Button variant="primary" onClick={hide}>
							Save Task
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

export default AddNewProject;
