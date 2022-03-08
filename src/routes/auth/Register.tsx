// Third party
import React from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'

// Local
import '../../style/base.css'
import baseTheme from '../../style/baseTheme'

// Configurations
import { REACT_APP_AUTH_URL } from '../../config'

function Register() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')

  const register = async (
    registrationFormData: React.FormEvent<HTMLFormElement>
  ) => {
    registrationFormData.preventDefault()
    const data = new FormData(registrationFormData.currentTarget)

    try {
      if (data.get('password') !== data.get('passwordConfirmation')) {
        throw new Error('Passwords do not match')
      }
      await axios.post(
        `${REACT_APP_AUTH_URL}/auth/register`,
        {
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          username: data.get('username'),
          email: data.get('email'),
          password: data.get('password')
        },
        { withCredentials: true }
      )
      navigate('/')
    } catch (err: any) {
      const registrationError = err.response?.data?.registrationError
      if (registrationError) {
        setErrorMessage(registrationError)
      } else if (err.message === 'Passwords do not match') {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('An unknown error occurred, please try again later')
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
              Register
            </Typography>
            <Box
              component='form'
              onSubmit={register}
              noValidate
              sx={{ input: { color: 'white' } }}
            >
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    margin='normal'
                    required
                    id='firstName'
                    label='First Name'
                    name='firstName'
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin='normal'
                    required
                    id='lastName'
                    label='Last Name'
                    name='lastName'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='username'
                    label='Username'
                    name='username'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
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
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    name='passwordConfirmation'
                    label='Confirm Password'
                    type='password'
                    id='password-confirmation'
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
                    Register
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Link href='/auth/login' variant='body2'>
                    Already have an account?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default Register
