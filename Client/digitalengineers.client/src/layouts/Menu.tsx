import helpBoxImage from '@/assets/images/svg/help-icon.svg';
import {type MenuItemType, ThemeSettings, useThemeContext } from '@/common';
import classNames from 'classnames';
import {Link, useLocation} from "react-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { findAllParent, findMenuItem } from './utils/menu';
import { useMenuBadges } from './utils/MenuBadgeProvider';
import { enhanceMenuItemsWithBadges } from './utils/enhanceMenuItems';


export type SubMenus = {
	item: MenuItemType;
	linkClassName?: string;
	subMenuClassNames?: string;
	activeMenuItems?: Array<string>;
	toggleMenu?: (item: MenuItemType, status: boolean) => void;
	className?: string;
};

const MenuItemWithChildren = ({ item, linkClassName, subMenuClassNames, activeMenuItems, toggleMenu }: SubMenus) => {
	const [open, setOpen] = useState<boolean>(item.expanded ?? activeMenuItems!.includes(item.key));

	const { settings } = useThemeContext();

	const collapseClass = settings.sidebar.size === ThemeSettings.sidebar.size.condensed;

	useEffect(() => {
		// If expanded is explicitly set, use it; otherwise use activeMenuItems
		if (item.expanded !== undefined) {
			setOpen(item.expanded);
		} else {
			setOpen(activeMenuItems!.includes(item.key));
		}
	}, [activeMenuItems, item]);

	const toggleMenuItem = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		const status = !open;
		setOpen(status);
		if (toggleMenu) toggleMenu(item, status);
		return false;
	};

	return (
		<li className={classNames('side-nav-item', { 'menuitem-active': open })}>
			<Link to="" onClick={toggleMenuItem} data-menu-key={item.key} aria-expanded={open} className={linkClassName}>
				{item.icon && <i className={item.icon}></i>}
				{!item.badge ? <span className="menu-arrow"></span> : <span className={`badge bg-${item.badge.variant} float-end`}>{item.badge.text}</span>}
				<span> {item.label} </span>
			</Link>
			<Collapse in={open}>
				<div className={collapseClass ? 'collapse' : ''}>
					<ul className={classNames(subMenuClassNames)} id="sidebarDashboards">
						{(item.children || []).map((child, index) => {
							return (
								<React.Fragment key={index.toString()}>
									{child.children ? (
										<MenuItemWithChildren
											item={child}
											linkClassName={activeMenuItems!.includes(child.key) ? 'active' : ''}
											activeMenuItems={activeMenuItems}
											subMenuClassNames="side-nav-third-level"
											toggleMenu={toggleMenu}
										/>
									) : (
										<MenuItem
											item={child}
											className={activeMenuItems!.includes(child.key) ? 'menuitem-active' : ''}
											linkClassName={activeMenuItems!.includes(child.key) ? 'active' : ''}
										/>
									)}
								</React.Fragment>
							);
						})}
					</ul>
				</div>
			</Collapse>
		</li>
	);
};

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
	return (
		<li className={className}>
			<MenuItemLink item={item} className={linkClassName} />
		</li>
	);
};

const MenuItemLink = ({ item, className }: SubMenus) => {
	return (
		<Link to={item.url!} target={item.target} className={`side-nav-link-ref ${className}`} data-menu-key={item.key}>
			{item.icon ? (
				<>
					<i className={item.icon}></i>
					<span>&nbsp;{item.label}</span>
				</>
			) : (
				item.label
			)}
			{item.badge && (
				<span
					className={classNames('badge', 'bg-' + item.badge.variant, 'rounded', 'font-10', 'float-end', {
						'text-dark': item.badge.variant === 'light',
						'text-light': item.badge.variant === 'dark' || item.badge.variant === 'secondary',
					})}
				>
					{item.badge.text}
				</span>
			)}
		</Link>
	);
};

type AppMenuProps = {
	menuItems: Array<MenuItemType>;
};

const AppMenu = ({ menuItems }: AppMenuProps) => {
	const location = useLocation();
	const menuRef = useRef<HTMLUListElement>(null);
	const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);
	
	const { projectCount, bidCount } = useMenuBadges();
	
	const enhancedMenuItems = useMemo(
		() => enhanceMenuItemsWithBadges(menuItems, { projectCount, bidCount }),
		[menuItems, projectCount, bidCount]
	);

	/*
	 * toggle the menus
	 */
	const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
		if (show) setActiveMenuItems([menuItem['key'], ...findAllParent(enhancedMenuItems, menuItem)]);
	};

	/**
	 * activate the menuitems
	 */
	const activeMenu = useCallback(() => {
		const div = document.getElementById('main-side-menu');
		let matchingMenuItem = null;

		if (div) {
			const items: HTMLCollectionOf<HTMLAnchorElement> = div.getElementsByClassName('side-nav-link-ref') as HTMLCollectionOf<HTMLAnchorElement>;
			for (let i = 0; i < items.length; ++i) {
				if (location.pathname === items[i].pathname) {
					matchingMenuItem = items[i];
					break;
				}
			}

			if (matchingMenuItem) {
				const mid = matchingMenuItem.getAttribute('data-menu-key');
				const activeMt = findMenuItem(enhancedMenuItems, mid!);
				if (activeMt) {
					setActiveMenuItems([activeMt['key'], ...findAllParent(enhancedMenuItems, activeMt)]);
				}
			}
		}
	}, [location, enhancedMenuItems]);

	useEffect(() => {
		activeMenu();
	}, [activeMenu]);

	return (
		<ul className="side-nav" ref={menuRef} id="main-side-menu">
			{(enhancedMenuItems || []).map((item, index) => {
				return (
					<React.Fragment key={index.toString()}>
						{item.isTitle ? (
							<li className="side-nav-title">{item.label}</li>
						) : (
							<>
								{item.children ? (
									<MenuItemWithChildren
										item={item}
										toggleMenu={toggleMenu}
										subMenuClassNames="side-nav-second-level"
										activeMenuItems={activeMenuItems}
										linkClassName="side-nav-link"
									/>
								) : (
									<MenuItem
										item={item}
										linkClassName="side-nav-link"
										className={`side-nav-item ${activeMenuItems.includes(item.key) ? 'menuitem-active' : ''}`}
									/>
								)}
							</>
						)}
					</React.Fragment>
				);
			})}

			{/*<div className="help-box text-white text-center">*/}
			{/*	<Link to="" className="float-end close-btn text-white">*/}
			{/*		<i className="mdi mdi-close" />*/}
			{/*	</Link>*/}
			{/*	<img src={helpBoxImage} height="90" alt="Helper Icon Image" />*/}
			{/*	<h5 className="mt-3">Unlimited Access</h5>*/}
			{/*	<p className="mb-3">Upgrade to plan to get access to unlimited reports</p>*/}
			{/*	<a*/}
			{/*		href="https://digital-engineers.com/hyper/"*/}
			{/*		className="btn btn-secondary btn-sm"*/}
			{/*		target="_blank"*/}
			{/*	>*/}
			{/*		Upgrade*/}
			{/*	</a>*/}
			{/*</div>*/}
		</ul>
	);
};

export default AppMenu;
