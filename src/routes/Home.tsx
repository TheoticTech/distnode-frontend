// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

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
          <Box>
            <CssBaseline />
            {posts.map((post: any) => (
              <Box key={post.id}>
                <Grid item xs={12}>
                  <Typography component='h3' variant='h3'>
                    {post.title}
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.body
                    }}
                  />
                </Grid>
              </Box>
            ))}
          </Box>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Home
