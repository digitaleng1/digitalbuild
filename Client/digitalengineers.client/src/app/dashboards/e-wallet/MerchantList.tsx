import classNames from 'classnames';
import { Card } from 'react-bootstrap';
import type { Merchant } from './types';
import {Link} from "react-router";
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';

type MerchantListProps = {
	merchantList: Merchant[];
};

const createMarkup = (text: string) => {
	return { __html: text };
};

const MerchantList = ({ merchantList }: MerchantListProps) => {
	return (
		<Card>

				<div className="card-header d-flex justify-content-between align-items-center">
					<h4 className="header-title mb-0">Merchant List</h4>
					<Link to="" className="btn btn-sm btn-light">
						<i className="mdi mdi-plus"></i>
					</Link>
				</div>
			<SimplebarReactClient style={{ maxHeight: '400px' }} className="card-body py-0">
				{(merchantList || []).map((merchant, index) => {
					return (
						<div className="d-flex align-items-center mb-3" key={index.toString()}>
							<div className="flex-shrink-0">
								<div className="avatar-sm rounded">
									<span
										className={classNames(
											'avatar-title',
											'bg-transparent',
											'border',
											'border-light',
											'text-' + merchant.variant,
											'rounded',
											'h3',
											'my-0'
										)}
									>
										<span dangerouslySetInnerHTML={createMarkup(merchant.icon)}></span>
									</span>
								</div>
							</div>
							<div className="flex-grow-1 ms-2">
								<Link to="" className="h4 my-0 fw-semibold text-secondary">
									{merchant.title}
									<i className="mdi mdi-check-decagram text-muted ms-1"></i>
								</Link>
							</div>
							<Link to="" className="font-16 text-muted">
								<i className="uil uil-angle-right-b"></i>
							</Link>
						</div>
					);
				})}
			</SimplebarReactClient>
		</Card>
	);
};

export default MerchantList;
