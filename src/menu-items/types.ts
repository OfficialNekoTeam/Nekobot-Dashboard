// ==============================|| MENU ITEM TYPES ||============================== //

export interface MenuItem {
  id: string;
  title: string;
  caption?: string;
  type: 'group' | 'collapse' | 'item' | 'divider';
  url?: string;
  icon?: string; // remixicon CSS 类名，例如 'ri-dashboard-line'
  breadcrumbs?: boolean;
  children?: MenuItem[];
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface MenuGroupProps {
  item: MenuItem;
  lastItem?: boolean;
  remItems?: MenuItem[];
  lastItemId?: string;
  selectedID: string;
  setSelectedID: (id: string) => void;
  isParents?: boolean;
}

export interface NavCollapseProps {
  item: MenuItem;
  level?: number;
  isParents?: boolean;
  setSelectedID: (id: string) => void;
  key: string;
}

export interface NavItemProps {
  item: MenuItem;
  level: number;
  isParents?: boolean;
  setSelectedID: (id: string) => void;
}
