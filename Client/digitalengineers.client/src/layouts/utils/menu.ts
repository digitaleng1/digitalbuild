import { HORIZONTAL_MENU_ITEMS, MENU_ITEMS,type MenuItemType } from '@/common/menu-items';
import {
	MENU_ITEMS_SUPERADMIN,
	MENU_ITEMS_ADMIN,
	MENU_ITEMS_CLIENT,
	MENU_ITEMS_PROVIDER,
	HORIZONTAL_MENU_ITEMS_SUPERADMIN,
	HORIZONTAL_MENU_ITEMS_ADMIN,
	HORIZONTAL_MENU_ITEMS_CLIENT,
	HORIZONTAL_MENU_ITEMS_PROVIDER,
} from '@/common/role-menu-items';
import { addRolePrefixToMenuItems } from './addRolePrefix';

type UserRole = 'SuperAdmin' | 'Admin' | 'Client' | 'Provider' | null;

const getRoleSpecificMenuItems = (role: UserRole): MenuItemType[] => {
	switch (role) {
		case 'SuperAdmin':
			return MENU_ITEMS_SUPERADMIN;
		case 'Admin':
			return MENU_ITEMS_ADMIN;
		case 'Client':
			return MENU_ITEMS_CLIENT;
		case 'Provider':
			return MENU_ITEMS_PROVIDER;
		default:
			return MENU_ITEMS;
	}
};

const getRoleSpecificHorizontalMenuItems = (role: UserRole): MenuItemType[] => {
	switch (role) {
		case 'SuperAdmin':
			return HORIZONTAL_MENU_ITEMS_SUPERADMIN;
		case 'Admin':
			return HORIZONTAL_MENU_ITEMS_ADMIN;
		case 'Client':
			return HORIZONTAL_MENU_ITEMS_CLIENT;
		case 'Provider':
			return HORIZONTAL_MENU_ITEMS_PROVIDER;
		default:
			return HORIZONTAL_MENU_ITEMS;
	}
};

const getMenuItems = (rolePrefix?: string | null, useTemplateMenu?: boolean, userRole?: UserRole) => {
	const items = useTemplateMenu ? MENU_ITEMS : getRoleSpecificMenuItems(userRole ?? null);
	return addRolePrefixToMenuItems(items, rolePrefix ?? null);
};

const getHorizontalMenuItems = (rolePrefix?: string | null, useTemplateMenu?: boolean, userRole?: UserRole) => {
	const items = useTemplateMenu ? HORIZONTAL_MENU_ITEMS : getRoleSpecificHorizontalMenuItems(userRole ?? null);
	return addRolePrefixToMenuItems(items, rolePrefix ?? null);
};

const findAllParent = (menuItems: MenuItemType[], menuItem: MenuItemType): string[] => {
	let parents: string[] = [];
	const parent = findMenuItem(menuItems, menuItem['parentKey']);

	if (parent) {
		parents.push(parent['key']);
		if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
	}
	return parents;
};

const findMenuItem = (menuItems: MenuItemType[] | undefined, menuItemKey: MenuItemType['key'] | undefined): MenuItemType | null => {
	if (menuItems && menuItemKey) {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].key === menuItemKey) {
				return menuItems[i];
			}
			const found = findMenuItem(menuItems[i].children, menuItemKey);
			if (found) return found;
		}
	}
	return null;
};

export { getMenuItems, getHorizontalMenuItems, findAllParent, findMenuItem };
