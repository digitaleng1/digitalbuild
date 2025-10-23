
import { Card, CardBody, Nav, Tab } from 'react-bootstrap';
import About from './About';
import Settings from './Settings';
import TimeLine from './TimeLine';
import { posts, projects } from './data';

const ProfileDetail = () => {
	return (
		<Tab.Container defaultActiveKey="timeline">
			<Card>
				<CardBody>
					<Nav as="ul" variant="pills" className="nav nav-pills bg-nav-pills nav-justified mb-3">
						<Nav.Item as="li" className="nav-item">
							<Nav.Link href="" eventKey="aboutme" className=" rounded-0">
								About
							</Nav.Link>
						</Nav.Item>
						<Nav.Item as="li" className="nav-item">
							<Nav.Link href="" eventKey="timeline" className=" rounded-0">
								Timeline
							</Nav.Link>
						</Nav.Item>
						<Nav.Item as="li" className="nav-item">
							<Nav.Link href="" eventKey="settings" className=" rounded-0">
								Settings
							</Nav.Link>
						</Nav.Item>
					</Nav>

					<Tab.Content>
						<Tab.Pane eventKey="aboutme">
							<About projects={projects} />
						</Tab.Pane>
						<Tab.Pane eventKey="timeline">
							<TimeLine posts={posts} />
						</Tab.Pane>
						<Tab.Pane eventKey="settings">
							<Settings />
						</Tab.Pane>
					</Tab.Content>
				</CardBody>
			</Card>
		</Tab.Container>
	);
};

export default ProfileDetail;
