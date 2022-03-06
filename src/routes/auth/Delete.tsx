// Third party
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'

// Local
import '../../style/base.css'
import baseTheme from '../../style/baseTheme'

// Configurations
import { REACT_APP_AUTH_URL } from '../../config'

function Delete() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')

  const confirmDelete = async (
    deleteFormData: React.FormEvent<HTMLFormElement>
  ) => {
    deleteFormData.preventDefault()
    const data = new FormData(deleteFormData.currentTarget)

    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        // First, ensure user has fresh CSRF token
        await axios.post(
          `${REACT_APP_AUTH_URL}/auth/login`,
          {
            email: data.get('email')?.toString().toLowerCase(),
            password: data.get('password')
          },
          { withCredentials: true }
        )
        // Then, delete user account
        await axios.delete(`${REACT_APP_AUTH_URL}/auth/delete-user`, {
          data: {
            email: data.get('email')?.toString().toLowerCase(),
            password: data.get('password'),
            csrfToken: Cookies.get('csrfToken')
          },
          withCredentials: true
        })
        navigate('/')
      } catch (err: any) {
        const loginError = err.response?.data?.loginError
        const deleteUserError = err.response?.data?.deleteUserError
        if (loginError) {
          setErrorMessage(loginError)
        } else if (deleteUserError) {
          setErrorMessage(deleteUserError)
        } else {
          setErrorMessage('An unknown error occurred, please try again later')
        }
      }
    }
  }

  return (
    <div className='App'>
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Delete Account
            </Typography>
            <Box
              component='form'
              onSubmit={confirmDelete}
              noValidate
              sx={{ input: { color: 'white' } }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                  />
                </Grid>
                <Grid item xs={12}>
                  {errorMessage && (
                    <Typography variant='body2' color='error'>
                      Error: {errorMessage}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default Delete
