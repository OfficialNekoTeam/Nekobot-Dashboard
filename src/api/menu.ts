import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

interface MenuMaster {
  isDashboardDrawerOpened: boolean;
}

interface UseGetMenuMasterReturn {
  menuMaster: MenuMaster;
  menuMasterLoading: boolean;
}

const initialState: MenuMaster = {
  isDashboardDrawerOpened: false
};

const endpoints = {
  key: 'api/menu',
  master: 'master'
};

export function useGetMenuMaster(): UseGetMenuMasterReturn {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue: UseGetMenuMasterReturn = useMemo(
    () => ({
      menuMaster: data || initialState,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean): void {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster?: MenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}