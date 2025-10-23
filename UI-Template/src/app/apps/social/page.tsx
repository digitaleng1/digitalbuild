import { Row, Col } from 'react-bootstrap';
import UserProfile from './UserProfile';
import Events from './Events';
import News from './News';
import Feeds from './Feeds';
import FeaturedVideo from './FeaturedVideo';
import Followers from './Followers';
import PageBreadcrumb from '@/components/PageBreadcrumb';




const SocialFeedApp = () => {
	return (
		<>
			<PageBreadcrumb title="Social Feed" subName="Apps" />

			<Row>
				<Col xxl={3} lg={6} className="order-lg-1 order-xxl-1">
					<UserProfile />
					<Events />
					<News />
				</Col>

				<Col xxl={6} lg={12} className="order-lg-2 order-xxl-1">
					<Feeds />
				</Col>

				<Col xxl={3} lg={6} className="order-lg-1 order-xxl-2">
					<FeaturedVideo />
					<Followers />
				</Col>
			</Row>
		</>
	);
};

export default SocialFeedApp;
