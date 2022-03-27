// Third party
import axios from 'axios'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import PostFeed from '../components/PostFeed'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = React.useState([])
  const [userID, setUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(`${REACT_APP_API_URL}/api/posts`, {
            withCredentials: true
          })
          setPosts(data.posts)
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

    const getUserID = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(`${REACT_APP_API_URL}/api/user/id`, {
            withCredentials: true
          })
          setUserID(data.userID)
        })
      } catch (err: any) {
        console.log('User not logged in. Requesting login now.')
        navigate('/auth/login')
      }
    }

    getUserID()
    getPosts()
  }, [])

  return (
    <div>
      <Navbar />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container component='main'>
            <CssBaseline />
            <PostFeed posts={posts} userID={userID} />
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Home
