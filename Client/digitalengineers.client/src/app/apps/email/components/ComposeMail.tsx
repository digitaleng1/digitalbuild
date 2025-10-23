import {Button, Col, Modal, Row} from 'react-bootstrap';
import {useComposeMail} from '../hooks';
import {Form, TextInput} from '@/components/Form';
import ReactQuill from 'react-quill-new';

import 'react-quill-new/dist/quill.snow.css';

type ComposeMailProps = {
	isModalOpen: boolean;
	toggleComposeModal: () => void;
};

const ComposeMail = ({ isModalOpen, toggleComposeModal }: ComposeMailProps) => {
	const { editorState, schema, handleEmailSave, onEditorStateChange } = useComposeMail(toggleComposeModal);

	return (
		<Modal show={isModalOpen} onHide={toggleComposeModal}>
			<Modal.Header closeButton onHide={toggleComposeModal} className="modal-colored-header bg-primary">
				<Modal.Title as="h4" className="text-white">New Message</Modal.Title>
			</Modal.Header>
			<div className="p-1">
				<Modal.Body className="px-3 pt-3 pb-0">
					<Form onSubmit={handleEmailSave} schema={schema}>
						<TextInput label="To" type="email" name="to" placeholder="example@email.com" containerClass={'mb-2'} />
						<TextInput label="Subject" type="text" name="subject" placeholder="Your subject" containerClass={'mb-2'} />
						<Row className="mb-3">
							<Col>
								<label className="form-label">Message</label>
								<ReactQuill id="bubble-editor" theme="snow" className='mb-4' value={editorState} onChange={onEditorStateChange} style={{ height: 150 }} />

							</Col>
						</Row>
						<div className="pb-3">
							<Button variant="primary" type="submit" className="me-1">
								<i className="mdi mdi-send me-1"></i> Send Message
							</Button>
							<Button variant="light" onClick={toggleComposeModal}>
								Cancel
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</div>
		</Modal>
	);
};

export default ComposeMail;
