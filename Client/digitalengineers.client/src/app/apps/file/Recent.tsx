import { Dropdown, ButtonGroup, Table, OverlayTrigger, Tooltip, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';
import type { RecentFileItem } from './types';
import {Link} from "react-router";


type RecentProps = {
	recentFiles: Array<RecentFileItem>;
};

const Recent = ({ recentFiles }: RecentProps) => {
	return (
		<div>
			<h5 className="mb-3 px-3">Recent</h5>

			<Table responsive className="table table-centered table-nowrap mb-0">
				<thead className="bg-light bg-opacity-50 thead-sm">
					<tr>
						<th className='ps-3'>Name</th>
						<th>Last Modified</th>
						<th>Size</th>
						<th>Owner</th>
						<th>Members</th>
						<th style={{ width: '80px' }}>
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{recentFiles.map((file, index) => {
						return (
							<tr key={index.toString()}>
								<td>
									<span className="ms-2 fw-semibold">
										<Link to="" className="text-reset">
											{file.name}
										</Link>
									</span>
								</td>
								<td>
									<p className="mb-0">{file.modifiedDate}</p>
									<span className="font-12">by {file.modifiedBy}</span>
								</td>
								<td>{file.size}</td>
								<td>{file.owner}</td>
								<td id="tooltip-container">
									<div className="avatar-group">
										{file.members.map((item, index) => {
											return (
												<OverlayTrigger key={index.toString()} placement="top" overlay={<Tooltip>{item.name}</Tooltip>}>
													<Link to="" className="avatar-group-item mb-0 me-1">
														<img src={item.image} className="rounded-circle avatar-xs" alt="friend" />
													</Link>
												</OverlayTrigger>
											);
										})}
									</div>
								</td>
								<td>
									<ButtonGroup className="d-block">
										<Dropdown align="end">
											<DropdownToggle className="table-action-btn dropdown-toggle arrow-none btn btn-light btn-xs">
												<i className="mdi mdi-dots-horizontal"></i>
											</DropdownToggle>
											<DropdownMenu>
												<DropdownItem>
													<i className="mdi mdi-share-variant me-2 text-muted vertical-middle"></i>
													Share
												</DropdownItem>
												<DropdownItem>
													<i className="mdi mdi-link me-2 text-muted vertical-middle"></i>
													Get Sharable Link
												</DropdownItem>
												<DropdownItem>
													<i className="mdi mdi-pencil me-2 text-muted vertical-middle"></i>
													Rename
												</DropdownItem>
												<DropdownItem>
													<i className="mdi mdi-download me-2 text-muted vertical-middle"></i>
													Download
												</DropdownItem>
												<DropdownItem>
													<i className="mdi mdi-delete me-2 text-muted vertical-middle"></i>
													Remove
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</ButtonGroup>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</div>
	);
};

export default Recent;
