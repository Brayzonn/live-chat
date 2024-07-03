import { createContext, ReactNode } from 'react';
import axios from 'axios';
import { useState  } from 'react';



interface AppContextProps {
    baseURL: string,
    supportTexts: string[],
    fetchSupportTexts: () => Promise<void>,
}

const AppContext = createContext<AppContextProps>({  
    supportTexts:  [],
    baseURL: '',
    fetchSupportTexts:  async () => {},
});

// Define the provider component
const AppProvider = ({ children }: { children: ReactNode }) => {
    //base url
    const baseURL = import.meta.env.VITE_BASE_URL || ''

    const [supportTexts, updateSupportTexts] = useState< string []>([''])
 
      
    // Get the token from sessionStorage
    const userToken = sessionStorage.getItem('userToken');

    const UserAuthConfig = {
          headers: {
              Authorization: `Bearer ${userToken}`,
          },
    };

    const fetchSupportTexts = async () => { 
      try {
          const response = await axios.get(`${baseURL}/api/user/getsupporttexts`, UserAuthConfig);
          const responseData = response.data;
          updateSupportTexts(responseData );
      } catch (error) {
          console.log(error)
      }  
  }

    return <AppContext.Provider value={{
        baseURL,
        fetchSupportTexts,
        supportTexts,
    }}>{children}</AppContext.Provider>;
};

const AppContextExports = { AppProvider, AppContext };

export default AppContextExports