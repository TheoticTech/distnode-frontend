// Third party
import axios from 'axios'
import Link from '@mui/material/Link'
import React from 'react'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import logo from '../media/logo.svg'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

function Home() {
  const navigate = useNavigate()
  const [userID, setUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    const getUserID = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(`${REACT_APP_API_URL}/api/whoami`, {
            withCredentials: true
          })
          setUserID(data)
        })
      } catch (err: any) {
        if (err instanceof AuthError) {
          navigate('/auth/login')
        } else {
          if (err.message) {
            setErrorMessage(err.message)
          } else {
            setErrorMessage(err)
          }
        }
      }
    }

    getUserID()
  }, [])

  return (
    <div className='App'>
      <img src={logo} className='App-logo' alt='logo' />
      {userID && <p>User ID: {userID}</p>}
      {userID == '' && (
        <Link href='/auth/login' variant='h4'>
          Login
        </Link>
      )}

      {errorMessage && (
        <Typography variant='body2' color='error'>
          Error: {errorMessage}
        </Typography>
      )}
    </div>
  )
}

export default Home
