
import {Link} from "react-router";
import { Card, CardBody, Nav, NavItem, Tab, TabContainer } from 'react-bootstrap';
import Posts from './Posts';

const FormPost = () => {
	return (
		<form action="#" className="comment-area-box">
			<textarea rows={4} className="form-control border-0 resize-none" placeholder="Write something...."></textarea>
			<div className="p-2 bg-light d-flex justify-content-between align-items-center">
				<div>
					<Link to="" className="btn btn-sm px-2 font-16 btn-light">
						<i className="uil uil-scenery"></i>
					</Link>
					<Link to="" className="btn btn-sm px-2 font-16 btn-light">
						<i className="uil uil-location"></i>
					</Link>
					<Link to="" className="btn btn-sm px-2 font-16 btn-light">
						<i className="uil uil-paperclip"></i>
					</Link>
				</div>
				<button type="submit" className="btn btn-sm btn-success">
					<i className="uil uil-message me-1"></i>Post
				</button>
			</div>
		</form>
	);
};

const Feeds = () => {
	return (
		<>
			<TabContainer defaultActiveKey="post">
				<Card>
					<CardBody className="p-0">
						<Nav variant="tabs" className="nav nav-tabs nav-bordered" as="ul">
							<NavItem as="li">
								<Nav.Link href="" eventKey="post" className='px-3 py-2'>
									<i className="mdi mdi-pencil-box-multiple font-18 d-md-none d-block"></i>
									<span className="d-none d-md-block">Create Post</span>
								</Nav.Link>
							</NavItem>
							<Nav.Item as="li">
								<Nav.Link href="" eventKey="video" className='px-3 py-2'>
									<i className="mdi mdi-image font-18 d-md-none d-block"></i>
									<span className="d-none d-md-block">Photos/Videos</span>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item as="li">
								<Nav.Link href="" eventKey="story" className='px-3 py-2'>
									<i className="mdi mdi-book-open-variant font-18 d-md-none d-block"></i>
									<span className="d-none d-md-block">Story</span>
								</Nav.Link>
							</Nav.Item>
						</Nav>

						<Tab.Content>
							<Tab.Pane eventKey="post" className="p-3">
								<div className="border rounded">
									<FormPost />
								</div>
							</Tab.Pane>
							<Tab.Pane eventKey="video" className="p-3">
								<div className="border rounded">
									<FormPost />
								</div>
							</Tab.Pane>
							<Tab.Pane eventKey="story" className="p-3">
								<div className="border rounded">
									<FormPost />
								</div>
							</Tab.Pane>
						</Tab.Content>
					</CardBody>
				</Card>
			</TabContainer>

			<Posts />
		</>
	);
};

export default Feeds;
