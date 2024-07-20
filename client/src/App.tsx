import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import AdminChatBox from './pages/AdminChatBox';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="*" element={<Landing />}/>
          <Route path='/' element={<Landing />}/>
          <Route path='/adminchatbox' element={<AdminChatBox />}/>
      </Routes>
    </Router>
  )
}

export default App
