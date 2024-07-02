import { useContext } from 'react';
import { AppContext } from './context';

// Hook for consuming the context
export const useGlobalContext = () => {
  return useContext(AppContext);
};
