import CardTitle from '@/components/CardTitle';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import classNames from 'classnames';
import { Fragment } from 'react';
import { Card } from 'react-bootstrap';
import type { WatchListItem } from './types';

type WatchListProps = {
	watchList: Array<WatchListItem>;
};

const WatchList = ({ watchList }: WatchListProps) => {
	return (
		<Card>
				<CardTitle
					containerClass="card-header d-flex justify-content-between align-items-center"
					title="My Watchlist"
					menuItems={[
						{ label: 'Refresh', icon: 'mdi mdi-cached' },
						{ label: 'Edit', icon: 'mdi mdi-circle-edit-outline' },
						{
							label: 'Remove',
							icon: 'mdi mdi-delete-outline',
							variant: 'text-danger',
						},
					]}
				/>

			<SimplebarReactClient style={{ maxHeight: '328px' }} className="card-body py-0">
				{(watchList || []).map((watch, index) => {
					return (
						<Fragment key={index.toString()}>
							<div className="d-flex align-items-center">
								<div className="flex-shrink-0">
									<div className="avatar-sm rounded">
										<span
											className={classNames(
												'avatar-title',
												'bg-' + watch.variant + '-lighten',
												'text-' + watch.variant,
												'border',
												'border-' + watch.variant,
												'rounded-circle',
												'h3',
												'my-0'
											)}
										>
											<i className={classNames(watch.icon)} />
										</span>
									</div>
								</div>
								<div className="flex-grow-1 ms-2">
									<h4 className="mt-0 mb-1 font-16 fw-semibold">{watch.title}</h4>
									<p className="mb-0 text-muted">{watch.amount}</p>
								</div>
								<p
									className={classNames('mb-0', {
										'text-success': watch.trendStatus === 'up',
										'text-danger': watch.trendStatus === 'down',
									})}
								>
									<i
										className={classNames('me-1', {
											'mdi mdi-trending-up': watch.trendStatus === 'up',
											'mdi mdi-trending-down': watch.trendStatus === 'down',
										})}
									></i>
									{watch.trend}
								</p>
							</div>

							<hr/>
						</Fragment>
					);
				})}
			</SimplebarReactClient>
		</Card>
	);
};

export default WatchList;
