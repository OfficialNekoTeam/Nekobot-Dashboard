import { useState, useEffect, useCallback } from 'react';

// ==============================|| HOOKS - LOCAL STORAGE ||============================== //

interface UseLocalStorageReturn<T> {
  state: T;
  setState: (state: T) => void;
  setField: (key: string, value: any) => void;
  resetState: () => void;
}

export function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
  // Load initial state from localStorage or fallback to default
  const readValue = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(readValue);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`Error setting localStorage key "${key}":`, err);
    }
  }, [key, state]);

  // Update single field
  const setField = useCallback((fieldKey: string, value: any) => {
    setState((prev: T) => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  // Reset to defaults
  const resetState = useCallback(() => {
    setState(defaultValue);
    window.localStorage.setItem(key, JSON.stringify(defaultValue));
  }, [defaultValue, key]);

  return { state, setState, setField, resetState };
}