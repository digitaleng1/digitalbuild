import {Link} from "react-router";
import PageBreadcrumb from '@/components/PageBreadcrumb';

import { Col, Container, Row } from 'react-bootstrap';

import notFoundImg from '@/assets/images/svg/file-searching.svg';

const Error404Alt = () => {
	return (
		<>
			<PageBreadcrumb title="Error 404" subName="Pages" />

			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col lg={4}>
							<div className="text-center">
								<img src={notFoundImg} height="90" alt="" />
								<h1 className="text-error mt-4">404</h1>
								<h4 className="text-uppercase text-danger mt-3">Page Not Found</h4>
								<p className="text-muted mt-3">
									It&apos;s looking like you may have taken a wrong turn. Don&apos;t worry... it happens to the best of us. Here&apos;s a little tip
									that might help you get back on track.
								</p>
								<Link className="btn btn-info mt-3" to="/public">
									<i className="mdi mdi-reply"></i> Return Home
								</Link>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default Error404Alt;
