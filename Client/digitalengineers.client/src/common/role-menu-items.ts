import type { MenuItemType } from './menu-items';


// Admin - System Management
export const MENU_ITEMS_ADMIN: MenuItemType[] = [
	{
		key: 'navigation',
		label: 'Navigation',
		isTitle: true,
	},
	{
		key: 'dashboards',
		label: 'Dashboards',
		isTitle: false,
		icon: 'uil-home-alt',
		children: [
			{
				key: 'ds-analytics',
				label: 'Analytics',
				url: '/dashboard/analytics',
				parentKey: 'dashboards',
			},
			{
				key: 'ds-crm',
				label: 'CRM',
				url: '/dashboard/crm',
				parentKey: 'dashboards',
			},
		],
	},
	{
		key: 'management',
		label: 'Management',
		isTitle: true,
	},
	{
		key: 'users',
		label: 'Users Management',
		isTitle: false,
		icon: 'uil-users-alt',
		children: [
			{
				key: 'users-providers',
				label: 'Providers',
				url: '/providers',
				parentKey: 'users',
			},
			{
				key: 'users-clients',
				label: 'Clients',
				url: '/clients',
				parentKey: 'users',
			},
		],
	},
	{
		key: 'projects-management',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		expanded: true,
		children: [
			{
				key: 'projects',
				label: 'Client Projects',
				url: '/projects',
				parentKey: 'projects-management',
			},
			{
				key: 'project-bids',
				label: 'Bids',
				url: '/bids',
				parentKey: 'projects-management',
			},
		],
	},
	{
		key: 'licenses',
		label: 'License Requests',
		isTitle: false,
		icon: 'uil-shield-check',
		url: '/licenses',
	},
	{
		key: 'professions-license-types',
		label: 'Professions & Licenses',
		isTitle: false,
		icon: 'uil-book-alt',
		url: '/professions-license-types',
	},
	{
		key: 'projects-tasks',
		label: 'Tasks',
		isTitle: false,
		icon: 'uil-clipboard-alt',
		expanded: true,
		children: [
			{
				key: 'task-list',
				label: 'List',
				url: '/tasks/list',
				parentKey: 'projects-tasks',
			},
			{
				key: 'task-kanban',
				label: 'Kanban Board',
				url: '/tasks/kanban',
				parentKey: 'projects-tasks',
			},
		],
	},
	{
		key: 'account',
		label: 'Account',
		isTitle: true,
	},
	{
		key: 'admin-profile',
		label: 'My Profile',
		isTitle: false,
		icon: 'uil-user',
		url: '/profile',
	},
];
// SuperAdmin - Full Access
export const MENU_ITEMS_SUPERADMIN: MenuItemType[] = MENU_ITEMS_ADMIN;



// Client - View Projects & Engineers
export const MENU_ITEMS_CLIENT: MenuItemType[] = [
	{
		key: 'navigation',
		label: 'Navigation',
		isTitle: true,
	},
	{
		key: 'dashboards',
		label: 'Dashboards',
		isTitle: false,
		icon: 'uil-home-alt',
		expanded: true,
		children: [
			{
				key: 'analytics',
				label: 'Analytics',
				isTitle: false,
				url: '/dashboard/analytics',
				parentKey: 'dashboards',
			},
			{
				key: 'ecommerce',
				label: 'Ecommerce',
				isTitle: false,
				url: '/dashboard/ecommerce',
				parentKey: 'dashboards',
			},
			{
				key: 'project',
				label: 'Projects',
				isTitle: false,
				url: '/dashboard/project',
				parentKey: 'dashboards',
			},
			{
				key: 'crm',
				label: 'CRM',
				isTitle: false,
				url: '/dashboard/crm',
				parentKey: 'dashboards',
			}
		]
	},
	
	{
		key: 'projects',
		label: 'Management',
		isTitle: true,
	},
	{
		key: 'my-projects',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		expanded: true,
		children: [
			{
				key: 'projects-active',
				label: 'Active Projects',
				url: '/projects',
				parentKey: 'my-projects',
			},
			{
				key: 'projects-create',
				label: 'Create Project',
				url: '/projects/create',
				parentKey: 'my-projects',
			},
		],
	},
	{
		key: 'client-bids',
		label: 'Bids',
		isTitle: false,
		icon: 'uil-file-alt',
		url: '/bids',
	},
	{
		key: 'projects-tasks',
		label: 'Tasks',
		isTitle: false,
		icon: 'uil-clipboard-alt',
		expanded: true,
		children: [
			{
				key: 'task-list',
				label: 'List',
				url: '/tasks/list',
				parentKey: 'projects-tasks',
			},
			{
				key: 'task-kanban',
				label: 'Kanban Board',
				url: '/tasks/kanban',
				parentKey: 'projects-tasks',
			},
		],
	},
	{
		key: 'account',
		label: 'Account',
		isTitle: true,
	},
	{
		key: 'client-profile',
		label: 'My Profile',
		isTitle: false,
		icon: 'uil-user',
		url: '/profile',
	}
];

// Provider - Manage Projects & Orders
export const MENU_ITEMS_PROVIDER: MenuItemType[] = [
	{
		key: 'navigation',
		label: 'Navigation',
		isTitle: true,
	},
	{
		key: 'dashboards',
		label: 'Dashboards',
		isTitle: false,
		icon: 'uil-home-alt',
		expanded: true,
		children: [
			{
				key: 'project',
				label: 'Projects',
				isTitle: false,
				url: '/dashboard/project',
				parentKey: 'dashboards',
			},
			{
				key: 'wallet',
				label: 'Wallet',
				isTitle: false,
				url: '/dashboard/e-wallet',
				parentKey: 'dashboards',
			}
		]
	},
	{
		key: 'work',
		label: 'My Work',
		isTitle: true,
	},
	{
		key: 'bids',
		label: 'Bid Requests',
		isTitle: false,
		icon: 'uil-file-alt',
		url: '/bids',
	},
	{
		key: 'projects',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-file-alt',
		url: '/projects',
	},
	{
		key: 'projects-tasks',
		label: 'Tasks',
		isTitle: false,
		icon: 'uil-clipboard-alt',
		expanded: true,
		children: [
			{
				key: 'task-list',
				label: 'List',
				url: '/tasks/list',
				parentKey: 'projects-tasks',
			},
			{
				key: 'task-kanban',
				label: 'Kanban Board',
				url: '/tasks/kanban',
				parentKey: 'projects-tasks',
			},
		],
	},
	{
		key: 'account',
		label: 'Account',
		isTitle: true,
	},
	{
		key: 'profile',
		label: 'Profile',
		isTitle: false,
		icon: 'uil-user',
		url: '/profile',
	},
];

// Horizontal menu variants
export const HORIZONTAL_MENU_ITEMS_SUPERADMIN: MenuItemType[] = MENU_ITEMS_SUPERADMIN;

export const HORIZONTAL_MENU_ITEMS_ADMIN: MenuItemType[] = MENU_ITEMS_ADMIN;

export const HORIZONTAL_MENU_ITEMS_CLIENT: MenuItemType[] = MENU_ITEMS_CLIENT;

export const HORIZONTAL_MENU_ITEMS_PROVIDER: MenuItemType[] = MENU_ITEMS_PROVIDER;
