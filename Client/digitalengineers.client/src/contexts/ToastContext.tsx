import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import logo from '@/assets/images/logo-sm.png';

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
		(type: ToastType, title: string, message: string, autoHide = true, delay = 1000) => {
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

	const value = {
		showToast,
		showSuccess,
		showError,
		showWarning,
		showInfo,
	};

	const getTimeAgo = () => {
		const now = new Date();
		return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						onClose={() => removeToast(toast.id)}
						show={true}
						autohide={toast.autoHide}
						delay={toast.delay}
						bg={
							toast.type === 'error'
								? 'danger'
								: toast.type === 'warning'
								? 'warning'
								: toast.type === 'success'
								? 'success'
								: 'info'
						}
						className="shadow"
						animation={true}
					>
						<Toast.Header closeButton>
							<img src={logo} alt="logo" height="12" className="me-2" />
							<strong className="me-auto">{toast.title}</strong>
							<small className="text-muted">{getTimeAgo()}</small>
						</Toast.Header>
						<Toast.Body
							className={
								toast.type === 'error' || toast.type === 'danger'
									? 'text-white'
									: 'text-dark'
							}
						>
							{toast.message}
						</Toast.Body>
					</Toast>
				))}
			</ToastContainer>
		</ToastContext.Provider>
	);
};
