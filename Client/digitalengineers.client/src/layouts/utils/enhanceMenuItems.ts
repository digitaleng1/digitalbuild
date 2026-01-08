import type { MenuItemType } from '@/common/menu-items';

interface BadgeCounts {
  projectCount: number;
  bidCount: number;
}

export const enhanceMenuItemsWithBadges = (
  menuItems: MenuItemType[],
  counts: BadgeCounts
): MenuItemType[] => {
  return menuItems.map(item => {
    // Project badges
    if (item.key === 'projects' || item.key === 'projects-active') {
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
    
    // Bid badges
    // Provider: 'bids' (Bid Requests - direct item)
    // Client: 'client-bids' (Bids - direct item)
    // Admin/SuperAdmin: 'project-bids' (Bids - child item)
    if (item.key === 'bids' || item.key === 'client-bids' || item.key === 'project-bids') {
      if (counts.bidCount > 0) {
        return {
          ...item,
          badge: {
            variant: 'warning',
            text: counts.bidCount.toString()
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
