import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Landing from './pages/Landing';
import AdminChatBox from './pages/AdminChatBox';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
          <Route path="*" element={<Landing />}/>
          <Route path='/' element={<Landing />}/>
          <Route path='/adminchatbox' element={<AdminChatBox />}/>
      </Routes>
    </Router>
  )
}

export default App
