import type { ApexOptions } from 'apexcharts';

const sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

function randomizeArray(arg: number[]) {
	const array = arg.slice();
	let currentIndex: number = array.length,
		temporaryValue,
		randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

export const spark1Opt: ApexOptions = {
	chart: {
		type: 'area',
		height: 160,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		width: 2,
		curve: 'straight',
	},
	fill: {
		opacity: 0.2,
	},
	series: [
		{
			name: 'Attex Sales ',
			data: randomizeArray(sparklineData),
		},
	],
	yaxis: {
		min: 0,
	},
	colors: ['#8f97f7'],
	title: {
		text: '$424,652',
		offsetX: 20,
		style: {
			fontSize: '24px',
		},
	},
	subtitle: {
		text: 'Sales',
		offsetX: 20,
		style: {
			fontSize: '14px',
		},
	},
};

export const Spark2Opt: ApexOptions = {
	chart: {
		type: 'area',
		height: 160,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		width: 2,
		curve: 'straight',
	},
	fill: {
		opacity: 0.2,
	},
	series: [
		{
			name: 'Attex Expenses ',
			data: randomizeArray(sparklineData),
		},
	],
	yaxis: {
		min: 0,
	},
	colors: ['#ffbc00'],
	title: {
		text: '$235,312',
		offsetX: 20,
		style: {
			fontSize: '24px',
		},
	},
	subtitle: {
		text: 'Expenses',
		offsetX: 20,
		style: {
			fontSize: '14px',
		},
	},
};

export const Spark3Opt: ApexOptions = {
	chart: {
		type: 'area',
		height: 160,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		width: 2,
		curve: 'straight',
	},
	fill: {
		opacity: 0.2,
	},
	series: [
		{
			name: 'Net Profits ',
			data: randomizeArray(sparklineData),
		},
	],
	xaxis: {
		crosshairs: {
			width: 1,
		},
	},
	yaxis: {
		min: 0,
	},
	colors: ['#0acf97'],
	title: {
		text: '$135,965',
		offsetX: 20,
		style: {
			fontSize: '24px',
		},
	},
	subtitle: {
		text: 'Profits',
		offsetX: 20,
		style: {
			fontSize: '14px',
		},
	},
};

export const Chart1Opt: ApexOptions = {
	chart: {
		type: 'line',
		width: 140,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	series: [
		{
			data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
		},
	],
	stroke: {
		width: 2,
		curve: 'smooth',
	},
	markers: {
		size: 0,
	},
	colors: ['#727cf5'],
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
export const Chart2Opt: ApexOptions = {
	chart: {
		type: 'line',
		width: 140,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	colors: ['#0acf97'],
	series: [
		{
			data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
		},
	],
	stroke: {
		width: 2,
		curve: 'smooth',
	},
	markers: {
		size: 0,
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
export const Chart3Opt: ApexOptions = {
	chart: {
		type: 'line',
		width: 140,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	colors: ['#ffbc00'],
	series: [
		{
			data: [47, 45, 74, 14, 56, 74, 14, 11, 7, 39, 82],
		},
	],
	stroke: {
		width: 2,
		curve: 'smooth',
	},
	markers: {
		size: 0,
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
export const Chart4Opt: ApexOptions = {
	chart: {
		type: 'line',
		width: 140,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	colors: ['#fa5c7c'],
	series: [
		{
			data: [15, 75, 47, 65, 14, 2, 41, 54, 4, 27, 15],
		},
	],
	stroke: {
		width: 2,
		curve: 'smooth',
	},
	markers: {
		size: 0,
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};

export const Chart5Opt: ApexOptions = {
	chart: {
		type: 'bar',
		width: 100,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: '80%',
		},
	},
	colors: ['#727cf5'],
	series: [
		{
			data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
		},
	],
	labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
	xaxis: {
		crosshairs: {
			width: 1,
		},
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
export const Chart6Opt: ApexOptions = {
	chart: {
		type: 'bar',
		width: 100,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: '80%',
		},
	},
	colors: ['#0acf97'],
	series: [
		{
			data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
		},
	],
	labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
	xaxis: {
		crosshairs: {
			width: 1,
		},
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
export const Chart7Opt: ApexOptions = {
	chart: {
		type: 'bar',
		width: 100,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: '80%',
		},
	},
	colors: ['#ffbc00'],
	series: [
		{
			data: [47, 45, 74, 14, 56, 74, 14, 11, 7, 39, 82],
		},
	],
	labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
	xaxis: {
		crosshairs: {
			width: 1,
		},
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
/* <<<<<<<<<<<<<<  ✨ Windsurf Command ⭐ >>>>>>>>>>>>>>>> */
/**
 * Formatter function for the tooltip's y-axis title.
 *
 * @param seriesName - The name of the series being displayed.
 * @returns A formatted string to display as the title in the tooltip.
 */

/* <<<<<<<<<<  8ffad544-61fa-4a16-9d2e-e79210576684  >>>>>>>>>>> */
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
export const Chart8Opt: ApexOptions = {
	chart: {
		type: 'bar',
		width: 100,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: '80%',
		},
	},
	colors: ['#fa5c7c'],
	series: [
		{
			data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
		},
	],
	labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
	xaxis: {
		crosshairs: {
			width: 1,
		},
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};
