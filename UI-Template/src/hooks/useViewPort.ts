import { useState, useEffect } from 'react';

const useViewport = () => {
	const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
	const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);

	const handleWindowResize = () => {
		if (typeof window !== 'undefined') {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		}
	};

	useEffect(() => {
		handleWindowResize();
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	}, []);
	return { width, height };
};

export default useViewport;
