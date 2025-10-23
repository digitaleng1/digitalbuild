import { FileUploader } from '@/components/FileUploader';
import PageBreadcrumb from '@/components/PageBreadcrumb';

import { Card, CardBody, Col, Row } from 'react-bootstrap';



const FileUploadsForm = () => {
	return (
		<>
			<PageBreadcrumb title="File Uploads" subName="Forms" />

			<Row>
				<Col>
					<Card>
						<CardBody>
							<h4 className="header-title">Dropzone File Upload</h4>
							<p className="text-muted fs-14">DropzoneJS is an open source library that provides drag’n’drop file uploads with image previews.</p>
							<FileUploader />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default FileUploadsForm;
