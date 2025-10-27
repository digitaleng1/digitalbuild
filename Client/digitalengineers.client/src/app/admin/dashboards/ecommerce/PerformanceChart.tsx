
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'react-bootstrap';
import type { ApexOptions } from 'apexcharts';
import CardTitle from '@/components/CardTitle';

const PerformanceChart = () => {
	const apexBarChartOpts: ApexOptions = {
		chart: {
			height: 260,
			type: 'bar',
			stacked: true,
			parentHeightOffset: 0,
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '20%',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		legend: {
			show: false,
		},
		colors: ['#727cf5', '#e3eaef'],
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			axisBorder: {
				show: false,
			},
		},
		yaxis: {
			labels: {
				formatter: function (val) {
					return val + 'k';
				},
			},
		},
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return '$' + val + 'k';
				},
			},
		},
	};

	const apexBarChartData = [
		{
			name: 'Actual',
			data: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 81],
		},
		{
			name: 'Projection',
			data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59],
		},
	];

	return (
		<Card className="card-h-100">
				<CardTitle
					containerClass="d-flex card-header justify-content-between align-items-center"
					title="Projections Vs Actuals"
					menuItems={[{ label: 'Sales Report' }, { label: 'Export Report' }, { label: 'Profit' }, { label: 'Action' }]}
				/>
			<CardBody className="p-0">
				<div dir="ltr">
					<Chart options={apexBarChartOpts} series={apexBarChartData} type="bar" className="apex-charts" height={255} />
				</div>
			</CardBody>
		</Card>
	);
};

export default PerformanceChart;
