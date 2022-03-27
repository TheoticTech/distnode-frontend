// Third party
import React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Edit from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Local
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import '../style/base.css'

function Profile() {
  const [errorMessage, setErrorMessage] = React.useState('')

  return (
    <div>
      <Navbar />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container component='main'>
            <CssBaseline />
            <Card>
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar
                  variant='rounded'
                  src='https://distnode-static-dev.sfo3.digitaloceanspaces.com/uploads/1632848807717.jpeg'
                  sx={{ alignSelf: 'center' }}
                />
                <Stack spacing={0.5}>
                  <Typography fontWeight={700}>Michael Scott</Typography>
                  <Typography variant='body2'>Senior Engineer</Typography>
                </Stack>
                <IconButton>
                  <Edit sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Divider />
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                sx={{ px: 2, py: 1 }}
              >
                <Link href='/auth/delete-user' variant='body1'>
                  Delete Account
                </Link>
              </Stack>
            </Card>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Profile
