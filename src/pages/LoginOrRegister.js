import Login from '../components/Login';
import Register from '../components/Register';
import { useState } from 'react';
import './LoginOrRegister.css'

function LoginOrRegister() {
    const [isLogin, setIsLogin] = useState(true)
  
    const switchLogin = () => {
      setIsLogin(!isLogin);
    }
  
    return (
      <div className="App">
        <div className='App_header'>
        </div>
        <div className='App_content'>
          {isLogin ? <Login sonSwitch={switchLogin} /> : <Register sonSwitch={switchLogin} />}
        </div>
        <div className='App_footer'>
          <h3>Web site created by No.4</h3>
        </div>
      </div>
    )
  }

  export default LoginOrRegister;