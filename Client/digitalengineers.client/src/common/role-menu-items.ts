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
		key: 'apps',
		label: 'Applications',
		isTitle: true,
	},
	{
		key: 'apps-projects',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		children: [
			{
				key: 'project-list',
				label: 'All Projects',
				url: '/apps/projects/list',
				parentKey: 'apps-projects',
			},
			{
				key: 'project-details',
				label: 'Project Details',
				url: '/apps/projects/details',
				parentKey: 'apps-projects',
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
		key: 'apps',
		label: 'Applications',
		isTitle: true,
	},
	{
		key: 'apps-projects',
		label: 'Projects',
		isTitle: false,
		icon: 'uil-briefcase',
		url: '/apps/projects/list',
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
	//{
	//	key: 'marketplace',
	//	label: 'Marketplace',
	//	isTitle: true,
	//},
	//{
	//	key: 'engineers',
	//	label: 'Find Engineers',
	//	isTitle: false,
	//	icon: 'uil-users-alt',
	//	url: '/pages/engineers',
	//},
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
export const HORIZONTAL_MENU_ITEMS_SUPERADMIN: MenuItemType[] = [
	{
		key: 'dashboards',
		icon: 'uil-dashboard',
		label: 'Dashboards',
		isTitle: true,
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
		icon: 'uil-users-alt',
		label: 'Management',
		isTitle: true,
		children: [
			{
				key: 'users-list',
				label: 'All Users',
				url: '/pages/users',
				parentKey: 'management',
			},
			{
				key: 'system-settings',
				label: 'Settings',
				url: '/pages/settings',
				parentKey: 'management',
			},
		],
	},
	{
		key: 'apps',
		icon: 'uil-apps',
		label: 'Apps',
		isTitle: true,
		children: [
			{
				key: 'apps-projects',
				label: 'Projects',
				url: '/apps/projects/list',
				parentKey: 'apps',
			},
			{
				key: 'apps-tasks',
				label: 'Tasks',
				url: '/apps/tasks/list',
				parentKey: 'apps',
			},
		],
	},
];

export const HORIZONTAL_MENU_ITEMS_ADMIN: MenuItemType[] = [
	{
		key: 'dashboards',
		icon: 'uil-dashboard',
		label: 'Dashboards',
		isTitle: true,
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
		key: 'users',
		icon: 'uil-users-alt',
		label: 'Users',
		isTitle: true,
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
		key: 'apps',
		icon: 'uil-apps',
		label: 'Apps',
		isTitle: true,
		children: [
			{
				key: 'apps-projects',
				label: 'Projects',
				url: '/apps/projects/list',
				parentKey: 'apps',
			},
			{
				key: 'apps-calendar',
				label: 'Calendar',
				url: '/apps/calendar',
				parentKey: 'apps',
			},
		],
	},
];

export const HORIZONTAL_MENU_ITEMS_CLIENT: MenuItemType[] = [
	{
		key: 'dashboard',
		icon: 'uil-dashboard',
		label: 'Dashboard',
		isTitle: true,
		url: '/dashboard/analytics',
	},
	{
		key: 'engineers',
		icon: 'uil-users-alt',
		label: 'Engineers',
		isTitle: true,
		url: '/pages/engineers',
	},
	{
		key: 'my-work',
		icon: 'uil-briefcase',
		label: 'My Work',
		isTitle: true,
		children: [
			{
				key: 'projects',
				label: 'Projects',
				url: '/apps/projects/list',
				parentKey: 'my-work',
			},
			{
				key: 'orders',
				label: 'Orders',
				url: '/apps/ecommerce/orders',
				parentKey: 'my-work',
			},
		],
	},
	{
		key: 'profile',
		icon: 'uil-user',
		label: 'Profile',
		isTitle: true,
		url: '/pages/profile',
	},
];

export const HORIZONTAL_MENU_ITEMS_PROVIDER: MenuItemType[] = [
	{
		key: 'dashboard',
		icon: 'uil-dashboard',
		label: 'Dashboard',
		isTitle: true,
		url: '/dashboard/project',
	},
	{
		key: 'work',
		icon: 'uil-briefcase',
		label: 'My Work',
		isTitle: true,
		children: [
			{
				key: 'projects',
				label: 'Projects',
				url: '/apps/projects/list',
				parentKey: 'work',
			},
			{
				key: 'tasks',
				label: 'Tasks',
				url: '/apps/tasks/list',
				parentKey: 'work',
			},
			{
				key: 'orders',
				label: 'Orders',
				url: '/apps/ecommerce/orders',
				parentKey: 'work',
			},
		],
	},
	{
		key: 'calendar',
		icon: 'uil-calender',
		label: 'Calendar',
		isTitle: true,
		url: '/apps/calendar',
	},
	{
		key: 'profile',
		icon: 'uil-user',
		label: 'Profile',
		isTitle: true,
		url: '/pages/profile',
	},
];
