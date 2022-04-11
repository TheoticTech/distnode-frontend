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
import { useNavigate, useLocation } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'

// Local
import '../style/base.css'
import baseTheme from '../style/baseTheme'

// Configurations
import { REACT_APP_AUTH_URL } from '../config'

function AuthLogin() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [requiresVerification, setRequiresVerification] = React.useState(false)
  const [emailSent, setEmailSent] = React.useState(false)
  const { state }: any = useLocation()

  const login = async (loginFormData: React.FormEvent<HTMLFormElement>) => {
    loginFormData.preventDefault()
    const data = new FormData(loginFormData.currentTarget)

    try {
      if (data.get('email') && data.get('email') !== '') {
        setEmail(data.get('email')?.toString().toLowerCase() as string)
      }
      const loginRes = await axios.post(
        `${REACT_APP_AUTH_URL}/auth/login`,
        {
          email: data.get('email')?.toString().toLowerCase(),
          password: data.get('password')
        },
        { withCredentials: true }
      )

      if (state?.next) {
        navigate(state.next)
      } else {
        navigate(`/user/view/${loginRes.data.userID}`)
      }
    } catch (err: any) {
      const loginError = err.response?.data?.loginError
      if (loginError) {
        if (loginError === 'Email must be verified before logging in') {
          setRequiresVerification(true)
        }
        setErrorMessage(loginError)
      } else {
        setErrorMessage('An unknown error occurred, please try again later')
      }
    }
  }

  const resendVerificationEmail = async () => {
    try {
      await axios.post(`${REACT_APP_AUTH_URL}/auth/resend-verification-email`, {
        email
      })
      setEmailSent(true)
      setErrorMessage('')
    } catch (err: any) {
      const resendVerificationError =
        err.response?.data?.resendVerificationError
      if (resendVerificationError) {
        setErrorMessage(resendVerificationError)
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
              Login
            </Typography>
            <Box
              component='form'
              onSubmit={login}
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
                {errorMessage && (
                  <Grid item xs={12}>
                    <Typography variant='body2' color='error'>
                      Error: {errorMessage}
                    </Typography>
                  </Grid>
                )}
                {emailSent && (
                  <Grid item xs={12}>
                    <Typography component='p' variant='body1'>
                      An email has been sent to you with a link to verify your
                      account.
                    </Typography>
                  </Grid>
                )}
                {!emailSent && requiresVerification ? (
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='secondary'
                      sx={{ mt: 2, width: '100%' }}
                      onClick={resendVerificationEmail}
                    >
                      Resend verification email
                    </Button>
                  </Grid>
                ) : null}

                <Grid item xs={12}>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Link href='/auth/password/reset/request' variant='body2'>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link href='/auth/register' variant='body2'>
                    Don&apos;t have an account?
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

export default AuthLogin
