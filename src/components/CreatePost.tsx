// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Cookies from 'js-cookie'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

const CreatePost = ({ createPostHandler }: any) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')

  const createPost = async (postData: React.FormEvent<HTMLFormElement>) => {
    postData.preventDefault()
    const data = new FormData(postData.currentTarget)

    try {
      return await apiHandler(async () => {
        const result = await axios.post(
          `${REACT_APP_API_URL}/api/posts/create`,
          {
            title: data.get('title'),
            body: data.get('body'),
            visibility: 'public',
            csrfToken: Cookies.get('csrfToken')
          },
          { withCredentials: true }
        )
        createPostHandler()
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
    <div>
      <ThemeProvider theme={baseTheme}>
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
      </ThemeProvider>

      {errorMessage && (
        <Typography variant='body2' color='error'>
          Error: {errorMessage}
        </Typography>
      )}
    </div>
  )
}

export default CreatePost
