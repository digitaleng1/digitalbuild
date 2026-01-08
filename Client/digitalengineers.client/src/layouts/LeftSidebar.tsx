import { useEffect, useRef } from 'react';
import AppMenu from './Menu';

// assets
import profileImg from '@/assets/images/users/avatar-1.jpg';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark.png';
import logoSm from '@/assets/images/logo-sm.png';
import logoDarkSm from '@/assets/images/logo-dark-sm.png';
import { getMenuItems } from './utils/menu';
import { Link } from "react-router";
import { useRolePrefix } from '@/common/hooks/useRolePrefix';
import { useUserRole } from '@/common/hooks/useUserRole';
import { useThemeContext } from '@/common/context';
import { useAuthContext } from '@/common/context/useAuthContext';
import { MenuBadgeProvider } from './utils/MenuBadgeProvider';

import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";

const UserBox = () => {
	const { user } = useAuthContext();
	const userRole = useUserRole();
	
	const username = user?.firstName && user?.lastName 
		? `${user.firstName} ${user.lastName}` 
		: user?.email || 'Guest';
	
	const userImage = user?.profilePictureUrl || profileImg;
	
	const profilePath = 
		userRole === 'SuperAdmin' || userRole === 'Admin'
			? '/admin/profile'
			: userRole === 'Client'
			? '/client/profile'
			: userRole === 'Provider'
			? '/specialist/profile'
			: '#';
	
	return (
		<div className="leftbar-user">
			<Link to={profilePath}>
				<img 
					src={userImage} 
					alt="user-image" 
					className="rounded-circle shadow-sm"
					style={{ width: '4rem', height: '4rem', objectFit: 'cover' }}
				/>
				<span className="leftbar-user-name mt-2">{username}</span>
			</Link>
		</div>
	);
};

const SideBarContent = () => {
	const rolePrefix = useRolePrefix();
	const userRole = useUserRole();
	const { settings } = useThemeContext();
	const useTemplateMenu = settings?.useTemplateMenu ?? false;
	
	return (
		<MenuBadgeProvider>
			<UserBox />
			<AppMenu menuItems={getMenuItems(rolePrefix, useTemplateMenu, userRole)} />
			<div className="clearfix" />
		</MenuBadgeProvider>
	);
};

type LeftSidebarProps = {
	hideLogo?: boolean;
	hideUserProfile: boolean;
	leftbarDark: boolean;
	isCondensed: boolean;
};

const LeftSidebar = ({ isCondensed, leftbarDark }: LeftSidebarProps) => {
	const menuNodeRef = useRef<HTMLDivElement>(null);

	/**
	 * Handle the click anywhere in doc
	 */
	const handleOtherClick = (e: MouseEvent) => {
		if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target as Node)) return;
		// else hide the menubar
		if (document.body) {
			document.body.classList.remove('sidebar-enable');
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOtherClick, false);

		return () => {
			document.removeEventListener('mousedown', handleOtherClick, false);
		};
	}, []);

	return (
		<div className="leftside-menu" ref={menuNodeRef}>
			<Link to="/" className={`logo ${leftbarDark ? 'logo-light' : 'logo-dark'}`}>
				<span className="logo-lg">
					<img src={leftbarDark ? logoDark : logo} alt="logo"
						style={{ height: '3rem' }}
					/>
				</span>
				<span className="logo-sm">
					<img src={leftbarDark ? logoDarkSm : logoSm} alt="logo"
						style={{ height: '2rem' }}
					/>
				</span>
			</Link>

			{!isCondensed && (
				<SimplebarReactClient style={{ maxHeight: '100%' }} scrollbarMaxSize={320}>
					<SideBarContent />
				</SimplebarReactClient>
			)}
			{isCondensed && <SideBarContent />}
		</div>
	);
};

export default LeftSidebar;
