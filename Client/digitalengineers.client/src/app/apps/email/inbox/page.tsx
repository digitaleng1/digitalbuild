import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import EmailInbox from './EmailInbox';




const InboxEmail = () => {
	return (
		<>
			<PageBreadcrumb title="Inbox" subName="Email" />

			<Row>
				<Col>
					<EmailInbox />
				</Col>
			</Row>
		</>
	);
};

export default InboxEmail;
