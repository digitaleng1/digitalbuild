import type { MenuItemType } from '@/common/menu-items';

export const addRolePrefixToMenuItems = (
	menuItems: MenuItemType[],
	rolePrefix: string | null
): MenuItemType[] => {
	if (!rolePrefix) {
		return menuItems;
	}

	return menuItems.map((item) => {
		const newItem = { ...item };

		if (newItem.url && !newItem.url.startsWith('/account') && !newItem.url.startsWith('/error') && newItem.url !== '/') {
			newItem.url = `/${rolePrefix}${newItem.url}`;
		}

		if (newItem.children) {
			newItem.children = addRolePrefixToMenuItems(newItem.children, rolePrefix);
		}

		return newItem;
	});
};
