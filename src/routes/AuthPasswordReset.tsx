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
import { useSearchParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { ThemeProvider } from '@mui/material/styles'

// Local
import '../style/base.css'
import baseTheme from '../style/baseTheme'

// Configurations
import { REACT_APP_AUTH_URL } from '../config'

function PasswordReset() {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [passwordResetSuccess, setPasswordResetSuccess] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const passwordReset = async (
    passwordResetFormData: React.FormEvent<HTMLFormElement>
  ) => {
    passwordResetFormData.preventDefault()
    const data = new FormData(passwordResetFormData.currentTarget)

    try {
      if (data.get('password') !== data.get('passwordConfirmation')) {
        throw new Error('Passwords do not match')
      }
      await axios.post(
        `${REACT_APP_AUTH_URL}/auth/password-reset?token=${searchParams.get(
          'token'
        )}`,
        {
          password: data.get('password')
        },
        { withCredentials: true }
      )
      setErrorMessage('')
      setPasswordResetSuccess(true)
    } catch (err: any) {
      const passwordResetError = err.response?.data?.passwordResetError
      if (passwordResetError) {
        setErrorMessage(passwordResetError)
        setPasswordResetSuccess(false)
      } else if (err.message === 'Passwords do not match') {
        setErrorMessage(err.message)
        setPasswordResetSuccess(false)
      } else {
        setErrorMessage('An unknown error occurred, please try again later')
        setPasswordResetSuccess(false)
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
              Reset Password
            </Typography>
            <Box
              component='form'
              onSubmit={passwordReset}
              noValidate
              sx={{ input: { color: 'white' } }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='New Password'
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
                  {passwordResetSuccess && (
                    <Typography variant='body2'>
                      Password reset successful!
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
                    Reset Password
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Link href='/' variant='body2'>
                    Home
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

export default PasswordReset
