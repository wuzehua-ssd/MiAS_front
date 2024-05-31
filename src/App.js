import './App.css';
import LoginOrRegister from './pages/LoginOrRegister';
import UserHome from './pages/User';
import EngineerHome from './pages/Engineer';
import RepositoryHome from './pages/Repository';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginOrRegister />} />
          <Route path='/user' element={<UserHome />} />
          <Route path='/engineer' element={<EngineerHome />} />
          <Route path='/repository' element={<RepositoryHome />} />
        </Routes>
      </Router> 
  );
}

export default App;
