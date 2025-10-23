import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import classnames from 'classnames';

import {Link} from "react-router";
import { useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useChatArea } from './hooks';
import type { ChatMessage, ChatUser } from './types';
import { Form, TextInput } from '@/components/Form';
import { chatSchema } from './hooks/useChatArea';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type UserMessageProps = {
	message: ChatMessage;
	toUser: ChatUser;
};

type ChatAreaProps = {
	selectedUser: ChatUser;
	toggle: () => void;
	toggleProfile: () => void;
};

const UserMessage = ({ message, toUser }: UserMessageProps) => {
	return (
		<li className={classnames('clearfix', { odd: message.from.id === toUser.id })}>
			<div className="chat-avatar">
				<img src={message.from.avatar} height={42} width={42} className="rounded" alt="" />
				<i>{message.sendOn}</i>
			</div>

			<div className="conversation-text">
				<div className="ctext-wrap">
					<i>{message.from.name}</i>
					{message.message.type === 'text' && <p>{message.message.value.text}</p>}
				</div>
				{message.message.type === 'file' && (
					<Card className="mt-2 mb-1 shadow-none border text-start">
						<div className="p-2">
							<Row className="align-items-center">
								<Col className="col-auto">
									<div className="avatar-sm">
										<span className="avatar-title rounded">
											<i className="uil uil-file-upload-alt font-20"></i>
										</span>
									</div>
								</Col>
								<Col className="ps-0">
									<Link to="" className="text-muted fw-bold">
										{message.message.value.file}
									</Link>
									<p className="mb-0">{message.message.value.size}</p>
								</Col>
								<Col className="col-auto">
									<Link to="" className="btn btn-link btn-lg text-muted">
										<i className="ri-download-2-line"></i>
									</Link>
								</Col>
							</Row>
						</div>
					</Card>
				)}
			</div>

			<Dropdown className="conversation-actions" align="end">
				<DropdownToggle variant="link" className="btn btn-sm btn-link arrow-none shadow-none">
					<i className="uil uil-ellipsis-v"></i>
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem>Copy Messaget</DropdownItem>
					<DropdownItem>Edit</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</li>
	);
};

const AlwaysScrollToBottom = () => {
	const elementRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (elementRef && elementRef.current && elementRef.current.scrollIntoView) {
			elementRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	});
	return <div ref={elementRef} />;
};

const ChatArea = ({ selectedUser, toggle, toggleProfile }: ChatAreaProps) => {
	const { toUser, userMessages, sendChatMessage, setInputMethods } = useChatArea(selectedUser);

	return (
		<Card className="overflow-hidden mb-0">
			<CardHeader className="border-0 border-bottom border-dashed">
				<div className="d-flex align-items-center gap-2">
					<button
						onClick={toggle}
						className="btn btn-light px-1 d-xxl-none d-inline-flex"
						data-bs-toggle="offcanvas"
						data-bs-target="#emailSidebaroffcanvas"
						aria-controls="emailSidebaroffcanvas"
					>
						<IconifyIcon icon="lucide:menu" className="font-18" />
					</button>
					<div className="d-flex align-items-start me-auto">
						<img src={selectedUser.avatar} className="me-2 rounded" height={36} alt="Brandon Smith" />
						<div>
							<h5 className="mt-0 mb-0 font-15">
								<a href="pages-profile.html" className="text-reset">
									{selectedUser.name}
								</a>
							</h5>
							<p className="mt-1 lh-1 mb-0 text-muted font-12">
								<small className="mdi mdi-circle text-success" /> Online
							</p>
						</div>
					</div>
					<div className="d-flex gap-3">
						<div className="d-none d-lg-inline-flex gap-3">
							<OverlayTrigger placement="top" overlay={<Tooltip>Voice Call</Tooltip>}>
								<Link to="" className="text-body font-18 d-inline-flex">
									<IconifyIcon icon="lucide:phone-call" />
								</Link>
							</OverlayTrigger>
							<OverlayTrigger placement="top" overlay={<Tooltip>Video Call</Tooltip>}>
								<Link to="" className="text-body font-18 d-inline-flex">
									<IconifyIcon icon="lucide:video" />
								</Link>
							</OverlayTrigger>
							<OverlayTrigger placement="top" overlay={<Tooltip>Add Users</Tooltip>}>
								<Link
									to=""
									className="text-body font-18 d-inline-flex"
									data-bs-toggle="tooltip"
									data-bs-placement="top"
									aria-label="Add Users"
									data-bs-original-title="Add Users"
								>
									<IconifyIcon icon="lucide:user-plus" />
								</Link>
							</OverlayTrigger>
							<OverlayTrigger placement="top" overlay={<Tooltip>Delete Chat</Tooltip>}>
								<Link
									to=""
									className="text-body font-18 d-inline-flex"
									data-bs-toggle="tooltip"
									data-bs-placement="top"
									aria-label="Delete Chat"
									data-bs-original-title="Delete Chat"
								>
									<IconifyIcon icon="lucide:trash-2" />
								</Link>
							</OverlayTrigger>
						</div>
						<div
							onClick={toggleProfile}
							className="cursor-pointer text-body font-18 d-xxl-none d-inline-flex"
							data-bs-toggle="offcanvas"
							data-bs-target="#userInfoOffcanvas"
							aria-controls="userInfoOffcanvas"
						>
							<IconifyIcon icon="lucide:info" />
						</div>
					</div>
				</div>
			</CardHeader>

			<CardBody className="p-0 pt-3">
				<SimplebarReactClient className="conversation-list px-3 chat-conversation" >
					{userMessages.map((message, index) => {
						return <UserMessage key={index.toString()} message={message} toUser={toUser} />;
					})}
					<AlwaysScrollToBottom />
				</SimplebarReactClient>
			</CardBody>

			<CardBody className="bg-light mt-2">
				<Form
					onSubmit={sendChatMessage}
					initCallback={(e) => setInputMethods(e)}
					schema={chatSchema}
					className="needs-validation"
					name="chat-form"
					id="chat-form"
				>
					<div className="d-flex align-items-start">
						<div className="w-100">
							<TextInput type="text" name="newMessage" className="border-0" placeholder="Enter your text" key="newMessage" />
							<div className="invalid-feedback">Please enter your messsage </div>
						</div>
						<div className="btn-group">
							<a href="#" className="btn btn-light d-none d-md-inline-block">
								<i className="uil uil-paperclip" />
							</a>
							<a href="#" className="btn btn-light d-none d-md-inline-block">
								{' '}
								<i className="uil uil-smile" />{' '}
							</a>
							<button type="submit" className="btn btn-success chat-send">
								<i className="uil uil-message" />
							</button>
						</div>
					</div>
				</Form>
			</CardBody>
		</Card>
	);
};

export default ChatArea;
