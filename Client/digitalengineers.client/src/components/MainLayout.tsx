import { useThemeContext } from '@/common';
import HorizontalLayout from '@/layouts/Horizontal';
import VerticalLayout from '@/layouts/Vertical';

const MainLayout = () => {
	const { settings } = useThemeContext();
	return <>{settings.layout.type === 'horizontal' ? <HorizontalLayout /> : <VerticalLayout />}</>;
};

export default MainLayout;
