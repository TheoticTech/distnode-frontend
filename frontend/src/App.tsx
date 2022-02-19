// Third party
import axios from 'axios'
import React from 'react'; 
import logo from './logo.svg';
import './App.css';

// Configurations
import { API_URL, AUTH_URL } from './config'

function App() {

  const [loginRes, setLoginRes] = React.useState([])
  const [whoamiRes, setWhoamiRes] = React.useState([])

  const login = async()=>{
    const response = await axios.post(
      `${AUTH_URL}/auth/login`,
      {
        "email": "jd@distnode.com",
        "password": "P@ssw0rd"
      },
      { withCredentials: true }
    )

    setLoginRes(response.data)    
  }

  const whoami = async()=>{
    const response = await axios(
      `${API_URL}/api/whoami`,
      { withCredentials: true }
    )
    setWhoamiRes(response.data)    
  }

  React.useEffect(() => {
    login();
    whoami();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          loginRes: { loginRes }
          whoamiRes: { whoamiRes }
        </p>
      </header>
    </div>
  );
}

export default App;
