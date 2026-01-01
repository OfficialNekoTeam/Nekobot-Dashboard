import { useContext } from 'react';
import { ConfigContext, ConfigContextValue } from 'contexts/ConfigContext';

// ==============================|| CONFIG - HOOKS ||============================== //

export default function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);

  if (!context) throw new Error('useConfig must be used inside ConfigProvider');

  return context;
}