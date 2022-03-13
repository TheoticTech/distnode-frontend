// Third party
import React from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'

// Local
import '../../style/base.css'
import baseTheme from '../../style/baseTheme'

// Configurations
import { REACT_APP_AUTH_URL } from '../../config'

function VerifyEmail() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')
  const [verifyEmailSuccess, setVerifyEmailSuccess] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  React.useEffect(() => {
    verifyEmail()
  }, [])

  const verifyEmail = async () => {
    try {
      await axios.post(
        `${REACT_APP_AUTH_URL}/auth/verify-email?token=${searchParams.get(
          'token'
        )}`,
        {},
        { withCredentials: true }
      )
      setVerifyEmailSuccess(true)
    } catch (err: any) {
      const verifyEmailError = err.response?.data?.verifyEmailError
      if (verifyEmailError) {
        setErrorMessage(verifyEmailError)
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
              Email Verification
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                {errorMessage && (
                  <Typography variant='body2' color='error'>
                    Error: {errorMessage}
                  </Typography>
                )}
                {verifyEmailSuccess && (
                  <Typography variant='body2'>
                    Congratulations, your email has been verified!
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Link href='/' variant='body2'>
                  Home
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default VerifyEmail
