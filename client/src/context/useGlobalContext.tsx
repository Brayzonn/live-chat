import { useContext } from 'react';
import AppContextExports from './context';

// Hook for consuming the context
export const useGlobalContext = () => {
    const {  AppContext } = AppContextExports;
    return useContext(AppContext);
};
