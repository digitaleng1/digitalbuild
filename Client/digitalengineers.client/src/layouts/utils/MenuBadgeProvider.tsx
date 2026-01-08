import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useProjectNotificationCount } from '@/app/shared/hooks/useProjectNotificationCount';
import { useBidNotificationCount } from '@/app/shared/hooks/useBidNotificationCount';

interface MenuBadgeContextValue {
  projectCount: number;
  bidCount: number;
}

const MenuBadgeContext = createContext<MenuBadgeContextValue>({
  projectCount: 0,
  bidCount: 0
});

export const useMenuBadges = () => useContext(MenuBadgeContext);

interface MenuBadgeProviderProps {
  children: ReactNode;
}

export const MenuBadgeProvider = ({ children }: MenuBadgeProviderProps) => {
  const projectCount = useProjectNotificationCount();
  const bidCount = useBidNotificationCount();
  
  const value = useMemo(() => ({
    projectCount,
    bidCount
  }), [projectCount, bidCount]);
  
  return (
    <MenuBadgeContext.Provider value={value}>
      {children}
    </MenuBadgeContext.Provider>
  );
};
