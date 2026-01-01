import { useEffect } from 'react';
import { matchPath } from 'react-router-dom';

// ==============================|| MENU TYPES ||============================== //

export interface NavItemType {
  id?: string;
  type?: string;
  link?: string;
  url?: string;
  title?: string;
  icon?: any;
  children?: NavItemType[];
  [key: string]: any;
}

// ==============================|| MENU COLLAPSED - RECURSIVE FUNCTION ||============================== //

/**
 * Recursively traverses menu items to find and open the correct parent menu.
 * If a menu item matches current pathname, it marks corresponding menu as selected and opens it.
 */

function setParentOpenedMenu(
  items: NavItemType[],
  pathname: string,
  menuId: string | undefined,
  setSelected: (value: string | null) => void,
  setOpen: (value: boolean) => void
): void {
  for (const item of items) {
    // Recursively check child menus
    if (item.children?.length) {
      setParentOpenedMenu(item.children, pathname, menuId, setSelected, setOpen);
    }

    // Check if current menu item matches pathname
    if (
      (item.link && matchPath({ path: item.link, end: false }, pathname)) ||
      item.url === pathname
    ) {
      setSelected(menuId ?? null); // Select the parent menu
      setOpen(true); // Open the menu
    }
  }
}

// ==============================|| MENU COLLAPSED - HOOK ||============================== //

/**
 * Hook to handle menu collapse behavior based on current route.
 * Automatically expands the parent menu of the active route item.
 */

export default function useMenuCollapse(
  menu: NavItemType,
  pathname: string,
  miniMenuOpened: boolean,
  setSelected: (value: string | null) => void,
  setOpen: (value: boolean) => void,
  setAnchorEl: (value: HTMLElement | null) => void
): void {
  useEffect(() => {
    setOpen(false); // Close the menu initially
    !miniMenuOpened ? setSelected(null) : setAnchorEl(null); // Reset selection based on menu state

    // If menu has children, determine which should be opened
    if (menu.children?.length) {
      setParentOpenedMenu(menu.children, pathname, menu.id, setSelected, setOpen);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);
}