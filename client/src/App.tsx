import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ClientChatBox from './pages/ClientChatBox';
import AdminRoutes from './Routes/AdminRoutes';
import AdminChatBox from './pages/AdminChatBox';
import Signin from './pages/Signin';

function App() {
  return (
    <Router>
        <ToastContainer />

        <Routes>
            <Route path="*" element={<Signin />}/>
            <Route path='/' element={<ClientChatBox />}/>
            <Route path='/signin' element={<Signin />}/>

            <Route element ={<AdminRoutes/>}>
                <Route path='/admin/adminchatbox' element={<AdminChatBox />}/>
            </Route>
        </Routes>

        
    </Router>
  )
}

export default App
