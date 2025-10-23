
import { Col, Offcanvas, Row } from 'react-bootstrap';
import ChatArea from './ChatArea';
import ChatProfile from './ChatProfile';
import ChatUsers from './ChatUsers';
import { useChatApp } from './hooks';
import { useState } from 'react';
import { useToggle } from '@/hooks';

const ChatApp = () => {
	const { selectedUser, onUserChange } = useChatApp();
	const [isOpen, toggle] = useToggle(false);
	const [profile, setProfile] = useState<boolean>(false);

	const toggleProfile = () => {
		setProfile(!profile);
	};

	return (
		<>
			<Row>
				<Col xxl={3}>
					<Offcanvas
						onHide={toggle}
						show={isOpen}
						placement="start"
						className="offcanvas-xxl  h-100 file-offcanvas"
						tabIndex={-1}
						id="emailSidebaroffcanvas"
						aria-labelledby="emailSidebaroffcanvasLabel"
					>
						<ChatUsers onUserSelect={onUserChange} />
					</Offcanvas>
					<div className="d-none d-lg-block">
						<ChatUsers onUserSelect={onUserChange} />
					</div>
				</Col>

				<Col xxl={6}>
					<ChatArea selectedUser={selectedUser} toggle={toggle} toggleProfile={toggleProfile} />
				</Col>

				<Col xxl={3}>
					<Offcanvas
						onHide={toggleProfile}
						show={profile}
						placement="end"
						className="offcanvas-xxl h-100 file-offcanvas"
						tabIndex={-1}
						id="userInfoOffcanvas"
						aria-labelledby="userInfoOffcanvasLabel"
					>
						<ChatProfile selectedUser={selectedUser} />
					</Offcanvas>
					<div className="d-none d-lg-block">
						<ChatProfile selectedUser={selectedUser} />
					</div>
				</Col>
			</Row>
		</>
	);
};

export default ChatApp;
