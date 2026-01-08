import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useProjectNotificationCount } from '@/app/shared/hooks/useProjectNotificationCount';

interface MenuBadgeContextValue {
  projectCount: number;
}

const MenuBadgeContext = createContext<MenuBadgeContextValue>({
  projectCount: 0
});

export const useMenuBadges = () => useContext(MenuBadgeContext);

interface MenuBadgeProviderProps {
  children: ReactNode;
}

export const MenuBadgeProvider = ({ children }: MenuBadgeProviderProps) => {
  const projectCount = useProjectNotificationCount();
  
  const value = useMemo(() => ({
    projectCount
  }), [projectCount]);
  
  return (
    <MenuBadgeContext.Provider value={value}>
      {children}
    </MenuBadgeContext.Provider>
  );
};
