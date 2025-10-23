export default function useSessionChart() {
	const getDaysInMonth = (month: number, year: number) => {
		const date = new Date(year, month, 1);
		const days = [];
		let idx = 0;
		while (date.getMonth() === month && idx < 15) {
			const d = new Date(date);
			days.push(d.getDate() + ' ' + d.toLocaleString('en-us', { month: 'short' }));
			date.setDate(date.getDate() + 1);
			idx += 1;
		}
		return days;
	};

	const now = new Date();
	const labels = getDaysInMonth(now.getMonth() + 1, now.getFullYear());
	return { labels };
}
