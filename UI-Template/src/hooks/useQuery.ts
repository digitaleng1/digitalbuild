
const useQuery = () => {
	const urlSearchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	return Object.fromEntries(urlSearchParams.entries());
};

export default useQuery;
