// Third party
import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'

// Local
import baseTheme from '../../style/baseTheme'
import Navbar from '../../components/Navbar'
import '../../style/base.css'

function Account() {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [shouldRefresh, setShouldRefresh] = React.useState(false)

  const handleNewPost = () => {
    setShouldRefresh(true)
  }

  return (
    <div>
      <Navbar navbarCreatePostHandler={handleNewPost} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container component='main' maxWidth='xs'>
            <CssBaseline />
          </Container>
        </ThemeProvider>

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Link href='/auth/delete-user' variant='body1'>
            Delete Account
          </Link>
        </Box>
      </div>
    </div>
  )
}

export default Account
