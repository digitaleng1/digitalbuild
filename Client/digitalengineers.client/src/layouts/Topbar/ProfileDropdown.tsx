import { Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import type { ProfileOption } from './types';
import { useToggle } from '@/hooks';
import { Link } from "react-router";
import { useLogout } from '@/hooks/useLogout';

type ProfileDropdownProps = {
	menuItems: Array<ProfileOption>;
	userImage: string;
	username: string;
	userTitle?: string;
};

const ProfileDropdown = ({ userTitle, username, menuItems, userImage }: ProfileDropdownProps) => {
	const [isOpen, toggleDropdown] = useToggle();
	const { logout } = useLogout();

	const handleMenuItemClick = (item: ProfileOption, e: React.MouseEvent) => {
		if (item.label === 'Logout') {
			e.preventDefault();
			logout();
			toggleDropdown();
		} else {
			toggleDropdown();
		}
	};

	return (
		<Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle
				variant="link"
				id="dropdown-profile"
				as={'button'}
				onClick={toggleDropdown}
				className="nav-link dropdown-toggle arrow-none nav-user px-2"
			>
				<span className="account-user-avatar">
					<img 
						src={userImage} 
						className="rounded-circle" 
						alt="user"
					/>
				</span>
				<span className="d-lg-flex flex-column gap-1 d-none">
					<h5 className="my-0">{username}</h5>
					<h6 className="my-0 fw-normal align-self-start">{userTitle}</h6>
				</span>
			</Dropdown.Toggle>
			<Dropdown.Menu align={'end'} className="dropdown-menu-animated profile-dropdown">
				<div>
					<div className="dropdown-header noti-title">
						<h6 className="text-overflow m-0">Welcome !</h6>
					</div>
					{menuItems.map((item, i) => {
						return (
							<Link 
								to={item.redirectTo} 
								className="dropdown-item notify-item" 
								key={i + '-profile-menu'}
								onClick={(e) => handleMenuItemClick(item, e)}
							>
								<i className={classNames(item.icon, 'me-1')}></i>
								<span>{item.label}</span>
							</Link>
						);
					})}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default ProfileDropdown;
