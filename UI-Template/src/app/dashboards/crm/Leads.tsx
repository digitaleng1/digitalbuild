import { Card, CardBody } from 'react-bootstrap';
import classNames from 'classnames';
import type { LeadItem } from './types';

import CardTitle from '@/components/CardTitle';

type LeadsProps = {
	recentLeads: LeadItem[];
};

const Leads = ({ recentLeads }: LeadsProps) => {
	return (
		<Card>
				<CardTitle
					containerClass="card-header d-flex justify-content-between align-items-center"
					title="Recent Leads"
					menuItems={[{ label: 'Settings' }, { label: 'Action' }]}
				/>

			<CardBody className='pt-2'>
				{(recentLeads || []).map((item, index) => {
					return (
						<div
							key={index.toString()}
							className={classNames('d-flex', 'align-items-start', {
								'mt-3': index != 0,
							})}
						>
							<img className="me-3 rounded-circle" src={item.profile} width="40" alt="Generic placeholder" />
							<div className="w-100 overflow-hidden">
								<span
									className={classNames('badge', 'float-end', {
										'badge-warning-lighten': item.status === 'Cold',
										'badge-danger-lighten': item.status === 'Lost',
										'badge-success-lighten': item.status === 'Won',
									})}
								>
									{item.status} lead
								</span>
								<h5 className="mt-0 mb-1">{item.name}</h5>
								<span className="font-13">{item.email}</span>
							</div>
						</div>
					);
				})}
			</CardBody>
		</Card>
	);
};

export default Leads;
