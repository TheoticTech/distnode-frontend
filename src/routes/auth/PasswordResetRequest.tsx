// Third party
import React from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
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

function PasswordResetRequest() {
  const [passwordResetSuccess, setPasswordResetSuccess] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const submitPasswordResetRequest = async (
    forgotPasswordFormData: React.FormEvent<HTMLFormElement>
  ) => {
    forgotPasswordFormData.preventDefault()
    const data = new FormData(forgotPasswordFormData.currentTarget)
    console.log(
      "data.get('email')?.toString().toLowerCase():",
      data.get('email')?.toString().toLowerCase()
    )
    try {
      await axios.get(
        `${REACT_APP_AUTH_URL}/auth/password-reset?email=${data
          .get('email')
          ?.toString()
          .toLowerCase()}`
      )
      setErrorMessage('')
      setPasswordResetSuccess(true)
    } catch (err: any) {
      const passwordResetError = err.response?.data?.passwordResetError
      if (passwordResetError) {
        setErrorMessage(passwordResetError)
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
              Reset Password
            </Typography>
            <Box
              component='form'
              onSubmit={submitPasswordResetRequest}
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
                  {errorMessage && (
                    <Typography variant='body2' color='error'>
                      Error: {errorMessage}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {passwordResetSuccess && (
                    <Typography variant='body2'>
                      Password reset email sent!
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
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default PasswordResetRequest
