import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { MultipleSeriesOpt } from './data';

const RadarMultiSeries = () => {
	const [data, setData] = useState([
		{
			name: 'Series 1',
			data: [80, 50, 30, 40, 100, 20],
		},
		{
			name: 'Series 2',
			data: [20, 30, 40, 80, 20, 80],
		},
		{
			name: 'Series 3',
			data: [44, 76, 78, 13, 43, 10],
		},
	]);

	function update() {
		function randomSeries() {
			const arr = [];
			for (let i = 0; i < 6; i++) {
				arr.push(Math.floor(Math.random() * 100));
			}
			return arr;
		}

		setData([
			{
				name: 'Series 1',
				data: randomSeries(),
			},
			{
				name: 'Series 2',
				data: randomSeries(),
			},
			{
				name: 'Series 3',
				data: randomSeries(),
			},
		]);
	}

	return (
		<div dir="ltr">
			<ReactApexChart className="apex-charts" options={MultipleSeriesOpt} height={350} series={data} type="radar" />
			<div className="text-center mt-2">
				<button onClick={update} className="btn btn-sm btn-primary">
					Update
				</button>
			</div>
		</div>
	);
};

export default RadarMultiSeries;
