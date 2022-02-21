// Third party
import axios from 'axios'
import React, { useEffect } from 'react'

// Local
import logo from '../media/logo.svg'
import '../style/base.css'

// Configurations
import { API_URL } from '../config'

function Home() {
  const [userID, setUserID] = React.useState('')

  React.useEffect(() => {
    const getUserID = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/whoami`, {
          withCredentials: true
        })
        setUserID(data)
      } catch (err) {
        console.error(err)
      }
    }

    getUserID()
  })

  return (
    <div className='App'>
      <img src={logo} className='App-logo' alt='logo' />
      {userID && <p>User ID: {userID}</p>}
      {userID == '' && <a href='/login'>Login</a>}
    </div>
  )
}

export default Home
