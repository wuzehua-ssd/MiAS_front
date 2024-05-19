import './App.css';
import LoginOrRegister from './pages/LoginOrRegister';
import UserHome from './pages/User';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginOrRegister />} />
          <Route path='/user' element={<UserHome />} />
        </Routes>
      </Router> 
  );
}

export default App;
