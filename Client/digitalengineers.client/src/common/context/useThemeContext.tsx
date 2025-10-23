import {createContext, type ReactNode, useCallback, useContext, useState, useEffect} from 'react';
import i18n, { isValidLanguage, Languages } from '@/common/languages/i18n';

const ThemeContext = createContext<any>({});

const THEME_SETTINGS_STORAGE_KEY = 'digitalengineers_theme_settings';

export const ThemeSettings = {
	layout: {
		type: { vertical: 'vertical', horizontal: 'horizontal' },
		mode: { fluid: 'fluid', boxed: 'boxed', detached: 'detached' },
		menuPosition: { scrollable: 'scrollable', fixed: 'fixed' },
	},
	theme: { light: 'light', dark: 'dark' },
	topbar: {
		theme: { light: 'light', dark: 'dark', brand: 'brand' },
		logo: { hidden: 'fullscreen', show: '' },
	},
	sidebar: {
		theme: { light: 'light', dark: 'dark', brand: 'brand' },
		size: {
			default: 'default',
			compact: 'compact',
			condensed: 'condensed',
			showOnHover: 'sm-hover',
			full: 'full',
			fullscreen: 'fullscreen',
		},
		user: { show: true, hidden: false },
	},
	rightSidebar: { show: true, hidden: false },
};

const getDefaultSettings = () => ({
	layout: {
		type: ThemeSettings.layout.type.vertical,
		mode: ThemeSettings.layout.mode.fluid,
		menuPosition: ThemeSettings.layout.menuPosition.fixed,
	},
	theme: ThemeSettings.theme.light,
	topbar: {
		theme: ThemeSettings.topbar.theme.light,
		logo: ThemeSettings.topbar.logo.show,
	},
	sidebar: {
		theme: ThemeSettings.sidebar.theme.dark,
		size: ThemeSettings.sidebar.size.default,
		user: ThemeSettings.sidebar.user.hidden,
	},
	rightSidebar: ThemeSettings.rightSidebar.hidden,
	useTemplateMenu: false,
});

const loadSettingsFromStorage = () => {
	try {
		const stored = localStorage.getItem(THEME_SETTINGS_STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('Failed to load theme settings from localStorage:', error);
	}
	return getDefaultSettings();
};

const saveSettingsToStorage = (settings: any) => {
	try {
		localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
	} catch (error) {
		console.error('Failed to save theme settings to localStorage:', error);
	}
};

export const clearStoredSettings = () => {
	try {
		localStorage.removeItem(THEME_SETTINGS_STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear theme settings from localStorage:', error);
	}
};

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useThemeContext must be used within an ThemeProvider');
	}
	return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [currentLanguage, setCurrentLanguage] = useState(Languages.EN);

	const [settings, setSettings] = useState(loadSettingsFromStorage);

	useEffect(() => {
		saveSettingsToStorage(settings);
	}, [settings]);

	const changeLanguage = useCallback((lang: string) => {
		if (isValidLanguage(lang)) {
			i18n.changeLanguage(lang);
			setCurrentLanguage(lang);
		}
	}, []);

	const updateSettings = useCallback(
		(newSettings: any) => {
			setSettings((prev) => ({ ...(prev ?? {}), ...(newSettings ?? {}) }));
		},
		[setSettings]
	);

	const updateLayout = useCallback(
		(newLayout: any) => {
			setSettings((prev) => ({
				...(prev ?? {}),
				layout: { ...(prev ?? {}).layout, ...(newLayout ?? {}) },
			}));
		},
		[setSettings]
	);

	const updateTopbar = useCallback(
		(newTopbar: any) => {
			setSettings((prev) => ({
				...(prev ?? {}),
				topbar: { ...(prev ?? {}).topbar, ...(newTopbar ?? {}) },
			}));
		},
		[setSettings]
	);

	const updateSidebar = useCallback(
		(newSidebar: any) => {
			setSettings((prev) => ({
				...(prev ?? {}),
				sidebar: { ...(prev ?? {}).sidebar, ...(newSidebar ?? {}) },
			}));
		},
		[setSettings]
	);

	const toggleTemplateMenu = useCallback(() => {
		setSettings((prev) => ({
			...(prev ?? {}),
			useTemplateMenu: !(prev ?? {}).useTemplateMenu,
		}));
	}, [setSettings]);

	return (
		<ThemeContext.Provider
			value={{
				changeLanguage,
				currentLanguage,
				settings,
				updateSettings,
				updateLayout,
				updateTopbar,
				updateSidebar,
				toggleTemplateMenu,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}
