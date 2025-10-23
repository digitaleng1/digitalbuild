import { useState } from 'react';
import { DonutUpdateOpt } from './data';
import ReactApexChart from 'react-apexcharts';

const DonutUpdateChart = () => {
	const [data, setData] = useState([44, 55, 13, 33]);

	function appendData() {
		const arr = data.map(function () {
			return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
		});
		arr.push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
		return setData(arr);
	}

	function removeData() {
		const arr = data.map(function () {
			return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
		});
		arr.pop();
		return setData(arr);
	}

	function randomize() {
		return setData(
			data.map(function () {
				return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
			})
		);
	}

	function reset() {
		return setData([44, 55, 13, 33]);
	}

	return (
		<>
			<div dir="ltr">
				<ReactApexChart className="apex-charts" options={DonutUpdateOpt} height={320} series={data} type="donut" />
			</div>
			<div className="text-center mt-2 d-flex gap-2 justify-content-center">
				<button className="btn btn-sm btn-primary" onClick={randomize}>
					RANDOMIZE
				</button>
				<button className="btn btn-sm btn-primary" onClick={appendData}>
					ADD
				</button>
				<button className="btn btn-sm btn-primary" onClick={removeData}>
					REMOVE
				</button>
				<button className="btn btn-sm btn-primary" onClick={reset}>
					RESET
				</button>
			</div>
		</>
	);
};

export default DonutUpdateChart;
