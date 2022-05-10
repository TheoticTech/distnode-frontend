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

// Constants
const DEFAULT_AVATAR_URL = `${REACT_APP_STATIC_URL}/resources/default-avatar.png`

const ProfileEdit = () => {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [avatar, setAvatar] = React.useState(DEFAULT_AVATAR_URL)
  const { userID } = useParams() // userID from URL

  React.useEffect(() => {
    const getActiveUserID = async () => {
      try {
        return await apiHandler({
          apiCall: async () => {
            const { data } = await axios.get(
              `${REACT_APP_API_URL}/api/user/id`,
              {
                withCredentials: true
              }
            )
            setActiveUserID(data.userID)
            if (data.userID !== userID) {
              console.error(
                'Not authorized to edit this profile. Returning to previous page.'
              )
              navigate(-1)
            }
          },
          onError: () => {
            navigate('/auth/login', { state: { next: `/user/edit/${userID}` } })
          }
        })
      } catch (err: any) {
        console.error(
          'An error occurred while calling apiHandler',
          'ProfileEdit - getActiveUserID'
        )
      }
    }

    const getUserData = async () => {
      try {
        return await apiHandler({
          apiCall: async () => {
            const { data } = await axios.get(
              `${REACT_APP_API_URL}/api/user/${userID}/profile`,
              {}
            )
            const { bio, avatar } = data.user
            setBio(bio)
            setAvatar(avatar)
          },
          onError: ({ error }: any) => {
            const getUserProfileError =
              error.response?.data?.getUserProfileError
            if (getUserProfileError && error.response?.status === 404) {
              setErrorMessage('User not found.')
            } else {
              setErrorMessage(
                'Unable to get user profile, please try again later.'
              )
            }
          }
        })
      } catch (err: any) {
        console.error(
          'An error occurred while calling apiHandler',
          'ProfileEdit - getUserData'
        )
      }
    }

    getActiveUserID()
    getUserData()
  }, [])

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await apiHandler({
        apiCall: async () => {
          const fd = new FormData()
          fd.append('media', e.target.files![0])
          fd.append('csrfToken', Cookies.get('csrfToken') as string)
          const response: any = await axios({
            method: 'post',
            url: `${REACT_APP_API_URL}/api/media/upload`,
            data: fd,
            withCredentials: true
          })
          setAvatar(response.data.file.location)
        },
        onError: () => {
          console.error('Unable to change image, please try again later.')
        }
      })
    }
  }

  const editProfile = async (
    editProfileData: React.FormEvent<HTMLFormElement>
  ) => {
    editProfileData.preventDefault()
    const data = new FormData(editProfileData.currentTarget)

    try {
      return await apiHandler({
        apiCall: async () => {
          await axios.post(
            `${REACT_APP_API_URL}/api/user/${userID}/profile/edit`,
            {
              ...(data.get('bio') && { bio: data.get('bio') }),
              ...(avatar !== DEFAULT_AVATAR_URL && { avatar }),
              csrfToken: Cookies.get('csrfToken')
            },
            { withCredentials: true }
          )
          navigate(`/user/view/${userID}`)
        },
        onError: ({ error }: any) => {
          if (error instanceof AuthError) {
            navigate('/auth/login')
          } else {
            const editProfileError = error.response?.data?.editProfileError
            if (editProfileError) {
              setErrorMessage(editProfileError)
            } else {
              setErrorMessage('Unable to edit profile, please try again later.')
            }
          }
        }
      })
    } catch (err: any) {
      console.error(
        'An error occurred while calling apiHandler',
        'ProfileEdit - editProfile'
      )
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
                      src={avatar}
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        width: '300px',
                        height: '300px',
                        borderRadius: '100%',
                        marginBottom: '1rem'
                      }}
                    />
                    <label htmlFor='uploadAvatar'>
                      <input
                        style={{ display: 'none' }}
                        id='uploadAvatar'
                        name='uploadAvatar'
                        type='file'
                        onChange={onImageChange}
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
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
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

export default ProfileEdit
