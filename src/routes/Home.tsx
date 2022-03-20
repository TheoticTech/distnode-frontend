// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = React.useState([])
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

    getPosts()
  }, [])

  return (
    <div>
      <Navbar />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container component='main' maxWidth='xs'>
            <CssBaseline />
          </Container>
        </ThemeProvider>

        {errorMessage && (
          <Typography variant='body2' color='error'>
            Error: {errorMessage}
          </Typography>
        )}

        {posts.map((post: any) => (
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            key={post.id}
          >
            <Typography component='h1' variant='h5'>
              {post.title}
            </Typography>
            <Typography component='p'>{post.body}</Typography>
          </Box>
        ))}
      </div>
    </div>
  )
}

export default Home
