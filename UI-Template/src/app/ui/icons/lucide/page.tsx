
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { lucideIcons } from './data';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageBreadcrumb from '@/components/PageBreadcrumb';



const LucideIcons = () => {
	return (
		<>
			<PageBreadcrumb title="Lucide Icons" subName="Icons" />
			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-2">
								Lucide Icons
								<a href="https://lucide.dev/" target="_blank" className="ms-2 d-inline-flex align-items-center">
									<span className="badge bg-primary align-middle">
										Docs <i className="mdi mdi-link font-12" />
									</span>
								</a>
							</h4>
							<p className="card-title-desc mb-2">
								Use <code>&lt;i data-lucide=&quot;accessibility&quot;&gt;&lt;/i&gt;</code>
							</p>
							<Row className="row-cols-lg-5 row-cols-md-3 row-cols-1 g-2 font-18 icons-list-demo" id="icons">
								{lucideIcons.map((icon, index) => (
									<Col xl={3} lg={4} sm={6} key={index}>
										<IconifyIcon icon={`lucide:${icon}`} /> {icon}
									</Col>
								))}
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default LucideIcons;
