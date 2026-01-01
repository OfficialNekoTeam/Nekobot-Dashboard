import { useEffect, useRef } from 'react';

// ==============================|| ELEMENT REFERENCE HOOKS ||============================== //

export default function useScriptRef(): React.MutableRefObject<boolean> {
  const scripted = useRef(true);

  useEffect(() => {
    scripted.current = false;
  }, []);

  return scripted;
}