import { Card, CardBody, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ProjectFile } from '@/types/project';
import { formatFileSize, getFileExtension } from '@/utils/projectUtils';

interface FilesProps {
	files: ProjectFile[];
}

const Files = ({ files }: FilesProps) => {
	if (!files || files.length === 0) {
		return (
			<Card>
				<CardBody>
					<h5 className="card-title mb-3">Files</h5>
					<p className="text-muted">No files uploaded yet</p>
				</CardBody>
			</Card>
		);
	}

	const getFileVariant = (contentType: string) => {
		if (contentType.startsWith('image/')) return 'primary';
		if (contentType.includes('pdf')) return 'danger';
		if (contentType.includes('zip') || contentType.includes('compressed')) return 'secondary';
		if (contentType.includes('word') || contentType.includes('document')) return 'info';
		return 'secondary';
	};

	return (
		<Card>
			<CardBody>
				<h5 className="card-title mb-3">Files</h5>

				{files.map((file) => {
					const extension = getFileExtension(file.fileName);
					const size = formatFileSize(file.fileSize);
					const variant = getFileVariant(file.contentType);

					return (
						<Card key={file.id} className="mb-1 shadow-none border">
							<div className="p-2">
								<Row className="align-items-center">
									<div className="col-auto">
										<div className="avatar-sm">
											<span className={`avatar-title bg-${variant} rounded`}>
												{extension}
											</span>
										</div>
									</div>
									<div className="col ps-0">
										<Link to={file.fileUrl} className="text-muted fw-bold" target="_blank">
											{file.fileName}
										</Link>
										<p className="mb-0">{size}</p>
									</div>
									<div className="col-auto">
										<Link to={file.fileUrl} className="btn btn-link btn-lg text-muted" target="_blank" download>
											<i className="ri-download-2-line"></i>
										</Link>
									</div>
								</Row>
							</div>
						</Card>
					);
				})}
			</CardBody>
		</Card>
	);
};

export default Files;
