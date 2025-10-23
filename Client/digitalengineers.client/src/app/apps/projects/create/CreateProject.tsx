
import { FileUploader } from '@/components/FileUploader';
import { CustomDatePicker, Form as RHForm, TextAreaInput, TextInput } from '@/components/Form';

import {Link} from "react-router";
import { useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, FormLabel, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useProjectForm } from '../hooks';

const CreateProject = () => {
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());

	const { teamMembers, selectedTeamMembers, schema, handleValidSubmit, selectTeamMembers } = useProjectForm();
	return (
		<Card>
			<CardBody>
				<Row>
					<Col>
						<RHForm onSubmit={handleValidSubmit} schema={schema}>
							<Row>
								<Col xl={6}>
									<TextInput type="text" name="name" label="Name" placeholder="Enter project name" containerClass={'mb-3'} key="name" />

									<TextAreaInput
										name="overview"
										label="Overview"
										placeholder="Enter some brief about project.."
										rows={5}
										containerClass={'mb-3'}
										key="overview"
									/>

									<FormGroup className="mb-3 position-relative">
										<FormLabel className="w-100">Start Date</FormLabel>
										<CustomDatePicker hideAddon={true} className="w-100" value={startDate} onChange={(date) => setStartDate(date)} />
									</FormGroup>

									<TextInput name="budget" label="Budget" placeholder="Enter project budget" type="number" containerClass={'mb-3'} key="budget" />

									<FormGroup className="mb-3">
										<FormLabel>Team Members</FormLabel>
										<Typeahead
											id="select3"
											labelKey="name"
											multiple={false}
											options={teamMembers}
											placeholder="select Team Member..."
											onChange={() => selectTeamMembers}
										/>
										<div className="mt-2">
											{selectedTeamMembers.map((member, index) => {
												return (
													<OverlayTrigger key={index.toString()} placement="top" overlay={<Tooltip>{member.name}</Tooltip>}>
														<Link to="" title={member.name} data-original-title="James Anderson" className="d-inline-block me-1">
															<img src={member.image} className="rounded-circle avatar-xs" alt="friend" />
														</Link>
													</OverlayTrigger>
												);
											})}
										</div>
									</FormGroup>
								</Col>
								<Col xl={6}>
									<FormGroup className="mb-3 mt-3 mt-xl-0">
										<FormLabel>Avatar</FormLabel>
										<p className="text-muted font-14">Recommended thumbnail size 800x400 (px).</p>
										<FileUploader />
									</FormGroup>

									<FormGroup className="mb-3">
										<FormLabel className="w-100">Due Date</FormLabel>
										<CustomDatePicker hideAddon={true} value={endDate} onChange={(date) => setEndDate(date)} />
									</FormGroup>
								</Col>
							</Row>

							<Row className="mt-2">
								<Col>
									<Button type="submit" variant="success">
										Submit
									</Button>
								</Col>
							</Row>
						</RHForm>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

export default CreateProject;
