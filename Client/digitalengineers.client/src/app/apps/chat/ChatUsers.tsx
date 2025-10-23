import React from 'react';
import { Card, CardBody } from 'react-bootstrap';
import classnames from 'classnames';
import type { ChatUser } from './types';
import { useChatUsers } from './hooks';

import {Link} from "react-router";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";

type ChatUsersProps = {
	onUserSelect: (value: ChatUser) => void;
};

const ChatUsers = ({ onUserSelect }: ChatUsersProps) => {
	const groupFilters = ['All', 'Favourties', 'Friends'];
	const { user, selectedUser, selectedGroup, filterUsers, search, activateUser } = useChatUsers(onUserSelect);

	return (
		<Card>
			<CardBody className="p-0">
				<ul className="nav nav-tabs nav-bordered nav-justified">
					{groupFilters.map((group, index) => {
						return (
							<li key={index} className="nav-item" onClick={() => filterUsers(group)}>
								<Link
									to=""
									className={classnames('nav-link', 'py-2', {
										'active': selectedGroup === group,
									})}
								>
									{group}
								</Link>
							</li>
						);
					})}
				</ul>

				<div className="tab-content">
					<div className="tab-pane show active card-body pb-0">
						<div className="app-search">
							<form>
								<div className="mb-2 w-100 position-relative form-group">
									<input
										type="text"
										className="form-control"
										placeholder="People, groups & messages..."
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value)}
									/>
									<span className="mdi mdi-magnify search-icon"></span>
								</div>
							</form>
						</div>

						<SimplebarReactClient style={{ maxHeight: '550px', width: '100%' }}>
							{user.map((user, index) => {
								return (
									<Link
										to=""
										key={index}
										className="text-body"
										onClick={() => {
											activateUser(user);
										}}
									>
										<div
											className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
												'bg-light-subtle ': user.id === selectedUser.id,
											})}
										>
											<img src={user.avatar} className="me-2 rounded-circle" height="48" alt="" />

											<div className="w-100 overflow-hidden">
												<h5 className="mt-0 mb-0 font-14">
													<span className="float-end text-muted font-12">{user.lastMessageOn}</span>
													{user.name}
												</h5>
												<p className="mt-1 mb-0 text-muted font-14">
													<span className="w-25 float-end text-end">
														{user.totalUnread && <span className="badge badge-danger-lighten">{user.totalUnread}</span>}
													</span>
													<span className="w-75">{user.lastMessage}</span>
												</p>
											</div>
										</div>
									</Link>
								);
							})}
						</SimplebarReactClient>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default ChatUsers;
