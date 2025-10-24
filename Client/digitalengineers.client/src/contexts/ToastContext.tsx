import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
	id: string;
	type: ToastType;
	title: string;
	message: string;
	autoHide?: boolean;
	delay?: number;
}

interface ToastContextType {
	showToast: (type: ToastType, title: string, message: string, autoHide?: boolean, delay?: number) => void;
	showSuccess: (title: string, message: string) => void;
	showError: (title: string, message: string) => void;
	showWarning: (title: string, message: string) => void;
	showInfo: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return context;
};

interface ToastProviderProps {
	children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = useCallback(
		(type: ToastType, title: string, message: string, autoHide = true, delay = 30000) => {
			const id = `${Date.now()}-${Math.random()}`;
			const newToast: ToastMessage = {
				id,
				type,
				title,
				message,
				autoHide,
				delay,
			};
			setToasts((prev) => [...prev, newToast]);
		},
		[]
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showSuccess = useCallback(
		(title: string, message: string) => {
			showToast('success', title, message);
		},
		[showToast]
	);

	const showError = useCallback(
		(title: string, message: string) => {
			showToast('error', title, message);
		},
		[showToast]
	);

	const showWarning = useCallback(
		(title: string, message: string) => {
			showToast('warning', title, message);
		},
		[showToast]
	);

	const showInfo = useCallback(
		(title: string, message: string) => {
			showToast('info', title, message);
		},
		[showToast]
	);

	const getToastBgClass = (type: ToastType): string => {
		switch (type) {
			case 'success':
				return 'bg-success';
			case 'error':
				return 'bg-danger';
			case 'warning':
				return 'bg-warning';
			case 'info':
				return 'bg-info';
			default:
				return 'bg-primary';
		}
	};

	const value = {
		showToast,
		showSuccess,
		showError,
		showWarning,
		showInfo,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						onClose={() => removeToast(toast.id)}
						show={true}
						autohide={toast.autoHide}
						delay={toast.delay}
						className={`${getToastBgClass(toast.type)} text-white`}
					>
						<Toast.Header closeButton closeVariant="white">
							<strong className="me-auto">{toast.title}</strong>
						</Toast.Header>
						<Toast.Body>{toast.message}</Toast.Body>
					</Toast>
				))}
			</ToastContainer>
		</ToastContext.Provider>
	);
};
