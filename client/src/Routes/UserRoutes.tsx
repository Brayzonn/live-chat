import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom';
// import { useGlobalContext } from '../context/useGlobalContext'


const UserRoutes = () => {
    
    const usertoken = window.sessionStorage.getItem(`userInfo`);     

    //clear session storage timeout
    useEffect(() => {
        // Set a timeout to clear session storage after 1 hour (3600000 milliseconds)
        const timeout = setTimeout(() => {
            // Clear session storage
            window.sessionStorage.clear();
        }, 1800000);
    
        // Clean up the timeout when the component unmounts
        return () => clearTimeout(timeout);
    }, []);
  
    return usertoken ? <Outlet /> : <Navigate to = '/' />
};

export default UserRoutes;