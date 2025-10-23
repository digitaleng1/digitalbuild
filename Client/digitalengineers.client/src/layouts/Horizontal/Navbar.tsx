import { getHorizontalMenuItems } from '../utils/menu';
import AppMenu from './Menu';
import { Collapse, Container } from 'react-bootstrap';
import { useRolePrefix } from '@/common/hooks/useRolePrefix';
import { useUserRole } from '@/common/hooks/useUserRole';
import { useThemeContext } from '@/common/context';

type NavbarProps = {
	isMenuOpened?: boolean;
};
const Navbar = ({ isMenuOpened }: NavbarProps) => {
	const rolePrefix = useRolePrefix();
	const userRole = useUserRole();
	const { settings } = useThemeContext();
	const useTemplateMenu = settings?.useTemplateMenu ?? false;
	
	return (
		<div className="topnav">
			<Container fluid>
				<nav className="navbar navbar-expand-lg">
					<Collapse in={isMenuOpened}>
						<div className="navbar-collapse active">
							<AppMenu menuItems={getHorizontalMenuItems(rolePrefix, useTemplateMenu, userRole)} />
						</div>
					</Collapse>
				</nav>
			</Container>
		</div>
	);
};

export default Navbar;
