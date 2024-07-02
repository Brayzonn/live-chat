import  { createContext, ReactNode } from 'react';

// Create the context
export const AppContext = createContext({});

// Define the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={{
    
  }}>{children}</AppContext.Provider>;
};
