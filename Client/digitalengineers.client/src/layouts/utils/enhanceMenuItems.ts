import type { MenuItemType } from '@/common/menu-items';

interface BadgeCounts {
  projectCount: number;
}

export const enhanceMenuItemsWithBadges = (
  menuItems: MenuItemType[],
  counts: BadgeCounts
): MenuItemType[] => {
  return menuItems.map(item => {
    if (item.key === 'my-projects' || item.key === 'projects-management' || item.key === 'projects') {
      if (counts.projectCount > 0) {
        return {
          ...item,
          badge: {
            variant: 'info',
            text: counts.projectCount.toString()
          }
        };
      }
    }
    
    if (item.children) {
      return {
        ...item,
        children: enhanceMenuItemsWithBadges(item.children, counts)
      };
    }
    
    return item;
  });
};
