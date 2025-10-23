
import { useThemeContext } from '@/common';


import logoDark from '@/assets/images/logo-dark.png';
import logo from '@/assets/images/logo.png';

const InvoiceLogo = () => {
	const { settings } = useThemeContext();

	const invoiceLogo = settings.theme === 'dark' ? logo : logoDark;

	return (
		<div className="float-start mb-3">
			<img src={invoiceLogo} alt="logo" height="22" />
		</div>
	);
};

export default InvoiceLogo;
