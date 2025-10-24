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
	const spinnerSize = size === 'sm' ? undefined : size === 'lg' ? 'lg' : undefined;
	
	const content = (
		<div className="text-center">
			<Spinner 
				animation="border" 
				role="status" 
				variant="primary"
				{...(spinnerSize && { size: spinnerSize })}
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
