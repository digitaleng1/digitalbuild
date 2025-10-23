import React from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import classNames from 'classnames';
import type{ NotificationItem } from './types';
import { useToggle } from '@/hooks';
import {Link} from "react-router";

import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";

// notifiaction continer styles
const notificationShowContainerStyle = {
	maxHeight: '300px',
};

type NotificationDropdownProps = {
	notifications: Array<NotificationItem>;
};

const NotificationDropdown = ({ notifications }: NotificationDropdownProps) => {
	const [isOpen, toggleDropdown] = useToggle();

	return (
		<Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle variant="link" id="dropdown-notification" onClick={toggleDropdown} className="nav-link dropdown-toggle arrow-none">
				<i className="ri-notification-3-line font-22"></i>
				<span className="noti-icon-badge"></span>
			</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu-animated dropdown-lg" align="end">
				<div onClick={toggleDropdown}>
				  <div className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 font-16 fw-semibold">	Notification</h6>
                            </Col>
                            <Col xs="auto">
                                <Link to='' className='text-dark text-decoration-underline'><small> Clear All</small></Link>
                            </Col>

                        </Row>
                    </div>
					<SimplebarReactClient className="p-2" style={notificationShowContainerStyle}>
						{notifications.map((item, index) => {
							return (
								<React.Fragment key={index.toString()}>
									<h5 className="text-muted font-12 text-uppercase mt-0">{item.day}</h5>
									{(item.messages || []).map((message, index) => {
										return (
											<Dropdown.Item
												key={index + '-noti'}
												className={classNames('p-0 notify-item card shadow-none mb-2', message.isRead ? 'read-noti' : 'unread-noti')}
											>
												<Card.Body>
													<span className="float-end noti-close-btn text-muted">
														<i className="mdi mdi-close"></i>
													</span>
													<div className="d-flex align-items-center">
														<div className="flex-shrink-0">
															<div className={classNames('notify-icon', message.variant && 'bg-' + message.variant)}>
																{message.avatar ? (
																	<img src={message.avatar} className="img-fluid rounded-circle" alt="" />
																) : (
																	<i className={message.icon}></i>
																)}
															</div>
														</div>
														<div className="flex-grow-1 text-truncate ms-2">
															<h5 className="noti-item-title fw-semibold font-14">
																{message.title}
																{message.time && <small className="fw-normal text-muted ms-1">{message.time}</small>}
															</h5>
															<small className="noti-item-subtitle text-muted">{message.subText}</small>
														</div>
													</div>
												</Card.Body>
											</Dropdown.Item>
										);
									})}
								</React.Fragment>
							);
						})}

						<div className="text-center">
							<i className="mdi mdi-dots-circle mdi-spin text-muted h3 mt-0"></i>
						</div>
					</SimplebarReactClient>

					<Dropdown.Item className="text-center text-primary notify-item border-top border-light py-2">View All</Dropdown.Item>
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default NotificationDropdown;
