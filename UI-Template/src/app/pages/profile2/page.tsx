import { Messages } from '@/components/Messages';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import ProfileDetail from './ProfileDetail';
import UserBox from './UserBox';




const ProfilePage2 = () => {
	return (
		<>
			<PageBreadcrumb title="Profile 2" subName="Pages" />
			<Row>
				<Col xl={4} lg={5}>
					{/* User information */}
					<UserBox />

					{/* User's recent messages */}
					<Messages />
				</Col>
				<Col xl={8} lg={7}>
					<ProfileDetail />
				</Col>
			</Row>
		</>
	);
};

export default ProfilePage2;
