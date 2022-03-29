// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { useNavigate, useParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL, REACT_APP_STATIC_URL } from '../config'

const AddPost = () => {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [formAvatar, setFormAvatar] = React.useState('')
  const [formBio, setFormBio] = React.useState('')
  const [userInfo, setUserInfo] = React.useState({
    username: '',
    userCreatedAt: Date.now(),
    userBio: '',
    userAvatar: ''
  })
  const { userID } = useParams() // userID from URL

  React.useEffect(() => {
    const getActiveUserID = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(`${REACT_APP_API_URL}/api/user/id`, {
            withCredentials: true
          })
          setActiveUserID(data.userID)
        })
      } catch (err: any) {
        console.log('Not logged in. Requesting login now.')
        navigate('/auth/login')
      }
    }

    const getUserData = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(
            `${REACT_APP_API_URL}/api/user/${userID}/profile`,
            {}
          )
          setUserInfo(data.user)
        })
      } catch (err: any) {
        const getUserProfileError = err.response?.data?.getUserProfileError
        if (getUserProfileError && err.response?.status === 404) {
          setErrorMessage('User not found.')
        } else {
          if (err.message) {
            setErrorMessage(err.message)
          } else {
            setErrorMessage(err)
          }
        }
      }
    }

    getActiveUserID()
    getUserData()
  }, [])

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // TODO: Upload image
      // setProfileImage(e.target.files[0])
    }
  }

  const editProfile = async (postData: React.FormEvent<HTMLFormElement>) => {
    postData.preventDefault()
    const data = new FormData(postData.currentTarget)

    try {
      const content = undefined
      if (!content) {
        setErrorMessage('Post body must not be empty')
      } else {
        return await apiHandler(async () => {
          const result = await axios.post(
            `${REACT_APP_API_URL}/api/posts/add`,
            {
              title: data.get('title'),
              description: data.get('description'),
              body: '',
              csrfToken: Cookies.get('csrfToken')
            },
            { withCredentials: true }
          )
          navigate('/')
        })
      }
    } catch (err: any) {
      if (err instanceof AuthError) {
        navigate('/auth/login')
      } else {
        const addPostError = err.response?.data?.addPostError
        if (addPostError) {
          setErrorMessage(addPostError)
        } else if (err.message) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage(err)
        }
      }
    }
  }

  return (
    <div>
      <Navbar activeUserID={activeUserID} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography component='h1' variant='h5'>
                Edit profile
              </Typography>
              <Box
                component='form'
                onSubmit={editProfile}
                noValidate
                sx={{ mt: 2, input: { color: 'white' } }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <img
                      src={
                        userInfo.userAvatar ||
                        `${REACT_APP_STATIC_URL}/resources/default-avatar.png`
                      }
                      style={{
                        width: '70%',
                        borderRadius: '100%',
                        border: '1px solid white'
                      }}
                    />
                    <label htmlFor='uploadAvatar'>
                      <input
                        style={{ display: 'none' }}
                        id='uploadAvatar'
                        name='uploadAvatar'
                        type='file'
                      />

                      <Button
                        color='secondary'
                        variant='contained'
                        component='span'
                      >
                        Select New Profile Picture
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      inputProps={{ style: { color: 'white' } }}
                      margin='normal'
                      multiline
                      minRows={4}
                      maxRows={7}
                      required
                      fullWidth
                      id='bio'
                      label='Bio'
                      name='bio'
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            {errorMessage && (
              <Typography variant='body2' color='error'>
                Error: {errorMessage}
              </Typography>
            )}
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default AddPost
