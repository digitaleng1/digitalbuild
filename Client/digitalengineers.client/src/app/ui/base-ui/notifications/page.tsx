import PageBreadcrumb from '@/components/PageBreadcrumb';
import AllToasts from './AllToasts';




const NotificationsUI = () => {
	return (
		<>
			<PageBreadcrumb title="Notifications" subName="Base UI" />

			{/* toast */}
			<AllToasts />
		</>
	);
};

export default NotificationsUI;
