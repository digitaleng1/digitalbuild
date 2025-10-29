import type { MenuItemType } from './menu-items';

// SuperAdmin - Full Access
export const MENU_ITEMS_SUPERADMIN: MenuItemType[] = [
	{
		key: 'navigation',
		label: 'Navigation',
		isTitle: true,
	},
	{
		key: 'dashboards',
		label: 'Dashboards',
		isTitle: false,
		expanded: true,
		icon: 'uil-home-alt',
		children: [
			{
				key: 'ds-analytics',
				label: 'Analytics',
				url: '/dashboard/analytics',
				parentKey: 'dashboards',
			},
			{
				key: 'ds-ecommerce',
				label: 'Ecommerce',
				url: '/dashboard/ecommerce',
				parentKey: 'dashboards',
			},
			{
				key: 'ds-project',
				label: 'Projects',
				url: '/dashboard/project',
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
		key: 'projects',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		children: [
			{
				key: 'project-list-admin',
				label: 'All Projects',
				url: '/projects',
				parentKey: 'projects',
			},
		],
	},
	{
		key: 'users',
		label: 'User Management',
		isTitle: false,
		icon: 'uil-users-alt',
		children: [
			{
				key: 'users-list',
				label: 'All Users',
				url: '/pages/users',
				parentKey: 'users',
			},
			{
				key: 'users-admins',
				label: 'Admins',
				url: '/pages/admins',
				parentKey: 'users',
			},
			{
				key: 'users-providers',
				label: 'Providers',
				url: '/pages/providers',
				parentKey: 'users',
			},
			{
				key: 'users-clients',
				label: 'Clients',
				url: '/pages/clients',
				parentKey: 'users',
			},
		],
	},

	{
		key: 'system',
		label: 'System Settings',
		isTitle: false,
		icon: 'uil-cog',
		children: [
			{
				key: 'system-settings',
				label: 'Settings',
				url: '/pages/settings',
				parentKey: 'system',
			},
			{
				key: 'system-logs',
				label: 'System Logs',
				url: '/pages/logs',
				parentKey: 'system',
			},
		],
	},
	{
		key: 'profile',
		label: 'Profile',
		isTitle: false,
		icon: 'uil-copy-alt',
		children: [
			{
				key: 'page-profile',
				label: 'Profile',
				url: '/pages/profile',
				parentKey: 'profile',
			},
		],
	},
];

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
		label: 'Users',
		isTitle: false,
		icon: 'uil-users-alt',
		children: [
			{
				key: 'users-providers',
				label: 'Providers',
				url: '/pages/providers',
				parentKey: 'users',
			},
			{
				key: 'users-clients',
				label: 'Clients',
				url: '/pages/clients',
				parentKey: 'users',
			},
		],
	},
	{
		key: 'projects',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		children: [
			{
				key: 'project-list-admin',
				label: 'All Projects',
				url: '/projects',
				parentKey: 'projects',
			},
		],
	},
	{
		key: 'apps-tasks',
		label: 'Tasks',
		isTitle: false,
		icon: 'uil-clipboard-alt',
		url: '/apps/tasks/list',
	},
	{
		key: 'apps-calendar',
		label: 'Calendar',
		isTitle: false,
		icon: 'uil-calender',
		url: '/apps/calendar',
	},
	{
		key: 'pages',
		label: 'Pages',
		isTitle: false,
		icon: 'uil-copy-alt',
		children: [
			{
				key: 'page-profile',
				label: 'Profile',
				url: '/pages/profile',
				parentKey: 'pages',
			},
		],
	},
];

// Client - View Projects & Engineers
export const MENU_ITEMS_CLIENT: MenuItemType[] = [
	{
		key: 'navigation',
		label: 'Navigation',
		isTitle: true,
	},
	{
		key: 'dashboard',
		label: 'Dashboard',
		isTitle: false,
		icon: 'uil-home-alt',
		url: '/dashboard/analytics',
	},
	{
		key: 'projects',
		label: 'Projects',
		isTitle: true,
	},
	{
		key: 'my-projects',
		label: 'My Projects',
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
		key: 'account',
		label: 'Account',
		isTitle: true,
	},
	{
		key: 'profile',
		label: 'Profile',
		isTitle: false,
		icon: 'uil-user',
		url: '/pages/profile',
	},
];

// Provider - Manage Projects & Orders
export const MENU_ITEMS_PROVIDER: MenuItemType[] = [
	{
		key: 'navigation',
		label: 'Navigation',
		isTitle: true,
	},
	{
		key: 'dashboard',
		label: 'Dashboard',
		isTitle: false,
		icon: 'uil-home-alt',
		url: '/dashboard/project',
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
		key: 'my-projects',
		label: 'My Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		children: [
			{
				key: 'projects-list',
				label: 'All Projects',
				url: '/apps/projects/list',
				parentKey: 'my-projects',
			},
			{
				key: 'projects-details',
				label: 'Project Details',
				url: '/apps/projects/details',
				parentKey: 'my-projects',
			},
			{
				key: 'projects-gantt',
				label: 'Gantt Chart',
			 url: '/apps/projects/gantt',
				parentKey: 'my-projects',
			},
		],
	},
	{
		key: 'my-tasks',
		label: 'Tasks',
		isTitle: false,
		icon: 'uil-clipboard-alt',
		children: [
			{
				key: 'tasks-list',
				label: 'Task List',
				url: '/apps/tasks/list',
				parentKey: 'my-tasks',
			},
			{
				key: 'tasks-kanban',
				label: 'Kanban Board',
				url: '/apps/tasks/kanban',
				parentKey: 'my-tasks',
			},
		],
	},
	{
		key: 'orders',
		label: 'Orders',
		isTitle: false,
		icon: 'uil-shopping-cart',
		children: [
			{
				key: 'orders-received',
				label: 'Received Orders',
				url: '/apps/ecommerce/orders',
				parentKey: 'orders',
			},
			{
				key: 'orders-history',
				label: 'Order History',
				url: '/apps/ecommerce/order-details',
				parentKey: 'orders',
			},
		],
	},
	{
		key: 'schedule',
		label: 'Calendar',
		isTitle: false,
		icon: 'uil-calender',
		url: '/apps/calendar',
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
		url: '/pages/profile',
	},
];

// Horizontal menu variants
export const HORIZONTAL_MENU_ITEMS_SUPERADMIN: MenuItemType[] = MENU_ITEMS_SUPERADMIN;

export const HORIZONTAL_MENU_ITEMS_ADMIN: MenuItemType[] = MENU_ITEMS_ADMIN;

export const HORIZONTAL_MENU_ITEMS_CLIENT: MenuItemType[] = MENU_ITEMS_CLIENT;

export const HORIZONTAL_MENU_ITEMS_PROVIDER: MenuItemType[] = MENU_ITEMS_PROVIDER;
