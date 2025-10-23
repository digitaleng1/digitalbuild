import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import classNames from 'classnames';

import { Card, CardBody } from 'react-bootstrap';
import type { TeamMember } from './types';

type TeamMembersProps = {
	members: Array<TeamMember>;
};

const TeamMembers = ({ members }: TeamMembersProps) => {
	return (
		<Card>
			<CardBody>
				<div className="d-flex justify-content-between align-items-center mb-2">
					<h4 className="header-title mb-0">Team Members</h4>
					<select name="select" className="form-select form-select-sm w-50" key="select">
						<option>Active</option>
						<option>Offline</option>
					</select>
				</div>
			</CardBody>
			<SimplebarReactClient className="card-body py-0" style={{ maxHeight: '308px' }}>
				{(members || []).map((member, index) => {
					return (
						<div className={classNames('d-flex', 'align-items-start', index === 0 ? 'mt-0' : 'mt-3')} key={index.toString()}>
							<img className="me-3 rounded-circle" src={member.avatar} width="40" alt="" />
							<div className="w-100 overflow-hidden">
								<h5 className="mt-0 mb-1 fw-semibold">{member.name}</h5>
								<ul className="list-inline mb-0 font-13">
									<li className="list-inline-item">{member.designation}</li>
									<li className="list-inline-item text-muted">
										<i className="mdi mdi-circle-small"></i>
									</li>
									<li className="list-inline-item text-muted">{member.experience} Experience</li>
								</ul>
							</div>
						</div>
					);
				})}
			</SimplebarReactClient>
		</Card>
	);
};

export default TeamMembers;
