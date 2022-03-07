// Third party
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import logo from '../media/logo.svg'
import '../style/base.css'
import baseTheme from '../style/baseTheme'

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

  const createPost = async (postData: React.FormEvent<HTMLFormElement>) => {
    postData.preventDefault()
    const data = new FormData(postData.currentTarget)

    try {
      return await apiHandler(async () => {
        await axios.post(
          `${REACT_APP_API_URL}/api/posts/create`,
          {
            title: data.get('title'),
            body: data.get('body'),
            visibility: 'public',
            csrfToken: Cookies.get('csrfToken')
          },
          { withCredentials: true }
        )
        window.location.reload()
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

  return (
    <div className='App'>
      <img src={logo} className='App-logo' alt='logo' />

      <ThemeProvider theme={baseTheme}>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              Create new post
            </Typography>
            <Box
              component='form'
              onSubmit={createPost}
              noValidate
              sx={{ input: { color: 'white' } }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='title'
                    label='Title'
                    name='title'
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='body'
                    label='Body'
                    name='body'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Post
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>

      {posts && <p>User ID: {JSON.stringify(posts)}</p>}

      {errorMessage && (
        <Typography variant='body2' color='error'>
          Error: {errorMessage}
        </Typography>
      )}
    </div>
  )
}

export default Home
