import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	text?: string;
	fullScreen?: boolean;
}

export default function LoadingSpinner({ 
	size = 'md', 
	text = 'Loading...', 
	fullScreen = false 
}: LoadingSpinnerProps) {
	// React Bootstrap Spinner only accepts 'sm' or undefined (default)
	const spinnerSize = size === 'sm' ? 'sm' : undefined;
	
	// Apply custom styles for larger sizes
	const spinnerStyle = size === 'lg' 
		? { width: '3rem', height: '3rem' } 
		: size === 'md' 
		? { width: '2rem', height: '2rem' }
		: undefined;
	
	const content = (
		<div className="text-center">
			<Spinner 
				animation="border" 
				role="status" 
				variant="primary"
				size={spinnerSize}
				style={spinnerStyle}
			>
				<span className="visually-hidden">Loading...</span>
			</Spinner>
			{text && <p className="mt-2 text-muted">{text}</p>}
		</div>
	);

	if (fullScreen) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
				{content}
			</div>
		);
	}

	return content;
}
