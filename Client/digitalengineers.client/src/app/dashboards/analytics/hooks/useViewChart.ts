export default function useViewChart() {
	// generate random data
	const getRandomData = (length: number) => {
		const d = [];
		for (let idx = 0; idx < length; idx++) {
			d.push(Math.floor(Math.random() * 90) + 10);
		}
		return d;
	};

	const categories = [];
	for (let i = 10; i >= 1; i--) {
		categories.push(i + ' min ago');
	}

	return { categories, getRandomData };
}
