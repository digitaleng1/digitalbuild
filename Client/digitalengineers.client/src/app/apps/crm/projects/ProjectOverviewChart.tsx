
import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
const ProjectOverviewChart = () => {
	const apexDonutOpts: ApexOptions = {
		grid: {
			padding: {
				left: 0,
				right: 0,
				top: 15,
				bottom: 15,
			},
		},
		chart: {
			height: 278,
			type: 'radialBar',
			parentHeightOffset: 0,
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			radialBar: {
				dataLabels: {
					name: {
						fontSize: '22px',
					},
					value: {
						fontSize: '16px',
					},
					total: {
						show: true,
						label: 'OS',
						formatter: function () {
							// By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
							return '8541';
						},
					},
				},
			},
		},
		colors: ['#727cf5', '#0acf97', '#fa5c7c', '#ffbc00'],
		labels: ['Product Design', 'Web Development', 'Illustration Design', 'UI/UX Design'],
	};

	// chart data
	const apexDonutData: number[] = [85, 70, 80, 65];
	return <Chart options={apexDonutOpts} series={apexDonutData} type="radialBar" height={327} className="apex-charts" />;
};

export default ProjectOverviewChart;
