import { Card, CardBody } from 'react-bootstrap';
import type { Person } from './types';
import avatar3 from '@/assets/images/users/avatar-3.jpg';
import avatar4 from '@/assets/images/users/avatar-4.jpg';
import avatar5 from '@/assets/images/users/avatar-2.jpg';
import avatar9 from '@/assets/images/users/avatar-9.jpg';
import avatar10 from '@/assets/images/users/avatar-5.jpg';
import CardTitle from '@/components/CardTitle';

import {Link} from "react-router";

const Followers = () => {
	const peopleToFollow: Person[] = [
		{
			id: 1,
			name: 'Robb Stark',
			status: 'The first king in the North',
			avatar: avatar5,
		},
		{
			id: 2,
			name: 'Sansa Stark',
			status: 'Lady of winterfall',
			avatar: avatar9,
		},
		{
			id: 3,
			name: 'Cersei Lannister',
			status: 'Queen of the Seven Kingdoms',
			avatar: avatar10,
		},
		{
			id: 4,
			name: 'Daenerys Targaryen',
			status: 'The dragon queen',
			avatar: avatar3,
		},
		{
			id: 5,
			name: 'Adhamd Annaway',
			status: 'I am available!',
			avatar: avatar4,
		},
	];

	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-2"
					title="People you may know"
					icon="mdi mdi-dots-horizontal"
					menuItems={[{ label: 'Today' }, { label: 'Yesterday' }, { label: 'Last Week' }, { label: 'Last Month' }]}
				/>

				<div className="inbox-widget">
					{peopleToFollow &&
						peopleToFollow.map((people, index) => {
							return (
								<div key={index.toString()} className="inbox-item">
									<div className="inbox-item-img">
										{people.avatar && <img src={people.avatar} height={40} width={40} className="rounded-circle" alt="" />}
									</div>
									<p className="inbox-item-author">{people.name}</p>
									<p className="inbox-item-text">{people.status}</p>
									<p className="inbox-item-date">
										<button type="button" className="btn btn-sm btn-outline-primary px-1 py-0">
											<i className="uil uil-user-plus font-16"></i>
										</button>
									</p>
								</div>
							);
						})}
				</div>

				<div className="mt-2 mb-3 text-center">
					<Link to="">
						View More<i className="uil uil-arrow-right ms-1"></i>
					</Link>
				</div>
			</CardBody>
		</Card>
	);
};

export default Followers;
