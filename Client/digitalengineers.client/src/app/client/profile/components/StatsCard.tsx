import React, { useMemo } from 'react';
import { Card, CardBody, Row, Col } from 'react-bootstrap';
import type { ClientStats } from '@/types/client';

interface StatsCardProps {
	stats: ClientStats;
}

interface StatItem {
	icon: string;
	title: string;
	value: number;
	color: string;
}

const StatsCard = React.memo(({ stats }: StatsCardProps) => {
	const statsItems: StatItem[] = useMemo(
		() => [
			{
				icon: 'mdi mdi-briefcase-outline',
				title: 'Total Projects',
				value: stats.totalProjects,
				color: 'primary',
			},
			{
				icon: 'mdi mdi-check-circle-outline',
				title: 'Active Projects',
				value: stats.activeProjects,
				color: 'success',
			},
			{
				icon: 'mdi mdi-format-list-checkbox',
				title: 'Total Tasks',
				value: stats.totalTasks,
				color: 'info',
			},
			{
				icon: 'mdi mdi-checkbox-marked-circle-outline',
				title: 'Completed Tasks',
				value: stats.completedTasks,
				color: 'success',
			},
			{
				icon: 'mdi mdi-clock-outline',
				title: 'In Progress Tasks',
				value: stats.inProgressTasks,
				color: 'warning',
			},
			{
				icon: 'mdi mdi-account-multiple-outline',
				title: 'Total Specialists',
				value: stats.totalSpecialists,
				color: 'purple',
			},
		],
		[stats]
	);

	return (
		<Card>
			<CardBody>
				<h4 className="header-title mb-3">Statistics</h4>
				<Row>
					{statsItems.map((stat, index) => (
						<Col key={index} md={4} className="mb-3">
							<div className="d-flex align-items-center">
								<div
									className={`widget-icon rounded-circle bg-${stat.color} text-white me-3`}
									style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
								>
									<i className={stat.icon} style={{ fontSize: '24px' }}></i>
								</div>
								<div className="flex-grow-1">
									<h5 className="mb-0">{stat.value}</h5>
									<p className="mb-0 text-muted">{stat.title}</p>
								</div>
							</div>
						</Col>
					))}
				</Row>
			</CardBody>
		</Card>
	);
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
