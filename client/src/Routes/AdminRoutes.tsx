import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';



const AdminRoutes = () => {

    const admintoken = window.sessionStorage.getItem(`adminToken`);         

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.sessionStorage.clear();
        }, 1800000);
    
        return () => clearTimeout(timeout);
    }, []);
  
    return admintoken ? <Outlet /> : <Navigate to = '/signin' />
};

export default AdminRoutes;