import { createContext, useContext, useMemo, ReactNode } from 'react';

// project imports
import config from '../config';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ==============================|| CONFIG TYPES ||============================== //

export interface ConfigState {
  fontFamily?: string;
  borderRadius?: number;
  [key: string]: any;
}

// ==============================|| CONFIG CONTEXT ||============================== //

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export interface ConfigContextValue {
  state: ConfigState;
  setState: (state: ConfigState) => void;
  setField: (key: string, value: any) => void;
  resetState: () => void;
}

// ==============================|| CONFIG PROVIDER ||============================== //

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { state, setState, setField, resetState } = useLocalStorage<ConfigState>('berry-config-vite-ts', config);

  const memoizedValue = useMemo(
    () => ({ state, setState, setField, resetState }),
    [state, setField, setState, resetState]
  );

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
}