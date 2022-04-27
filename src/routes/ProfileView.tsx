// Third party
import React from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate, useParams } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Local
import { apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import { PostCardProps } from '../types/PostCardProps'
import PostFeed from '../components/PostFeed'
import '../style/base.css'

// Configurations
import {
  REACT_APP_API_URL,
  REACT_APP_AUTH_URL,
  REACT_APP_STATIC_URL
} from '../config'

function ProfileView() {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [userInfo, setUserInfo] = React.useState({
    username: '',
    userCreatedAt: Date.now(),
    bio: '',
    avatar: ''
  })
  const [posts, setPosts] = React.useState([] as PostCardProps[])
  const [errorMessage, setErrorMessage] = React.useState('')
  const [profileOptionsMenuEl, setProfileOptionsMenuEl] =
    React.useState<null | HTMLElement>(null)
  const { userID } = useParams() // userID from URL
  const open = Boolean(profileOptionsMenuEl)

  const handleProfileMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setProfileOptionsMenuEl(event.currentTarget)
  }
  const handleProfileMenuClose = () => {
    setProfileOptionsMenuEl(null)
  }

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
        console.log('Not logged in. Viewing in guest mode.')
      }
    }

    const getProfileData = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(
            `${REACT_APP_API_URL}/api/user/${userID}/profile`,
            { withCredentials: true }
          )
          setUserInfo(data.user)
          setPosts(data.posts)
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
    getProfileData()
  }, [])

  const onPostReaction = ({ postID, reactionType }: any) => {
    const newPosts = posts.map((post: PostCardProps) => {
      if (post.postID === postID) {
        return {
          ...post,
          reaction: reactionType
        }
      }
      return post
    })
    setPosts(newPosts)
  }

  return (
    <div>
      <Navbar activeUserID={activeUserID} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container
            component='main'
            maxWidth={'xl'}
            sx={{ justifyContent: 'center' }}
          >
            <CssBaseline />
            {errorMessage && (
              <Typography variant='h6' color='error'>
                {errorMessage}
              </Typography>
            )}
            {!errorMessage && (
              <Grid>
                <Card sx={{ m: 2, position: 'relative' }}>
                  {activeUserID === userID && (
                    <div>
                      <Grid
                        sx={{
                          position: 'absolute',
                          top: '0px',
                          right: '0px'
                        }}
                      >
                        <IconButton
                          id='profile-options-button'
                          sx={{
                            m: 2,
                            color: 'white',
                            '&:hover': {
                              color: '#4FC1F1'
                            }
                          }}
                          onClick={handleProfileMenuButtonClick}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Grid>
                      <Menu
                        id='profile-options-menu'
                        anchorEl={profileOptionsMenuEl}
                        open={open}
                        onClose={handleProfileMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'profile-options-button'
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleProfileMenuClose()
                            navigate(`/user/edit/${activeUserID}`)
                          }}
                        >
                          Edit Profile
                        </MenuItem>
                        <MenuItem
                          onClick={async () => {
                            handleProfileMenuClose()
                            await axios.post(
                              `${REACT_APP_AUTH_URL}/auth/logout`,
                              {},
                              { withCredentials: true }
                            )
                            navigate('/')
                          }}
                        >
                          Logout
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => {
                            handleProfileMenuClose()
                            navigate('/auth/delete')
                          }}
                          sx={{ color: 'red' }}
                        >
                          Delete Account
                        </MenuItem>
                      </Menu>
                    </div>
                  )}
                  <Grid
                    container
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Grid item md={4} xs={12}>
                      <img
                        src={
                          userInfo.avatar ||
                          `${REACT_APP_STATIC_URL}/resources/default-avatar.png`
                        }
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '280px',
                          height: '280px',
                          borderRadius: '100%'
                        }}
                      />
                      {activeUserID === userID && !userInfo.avatar && (
                        <Button
                          color='primary'
                          variant='contained'
                          component='span'
                          onClick={() => {
                            navigate(`/user/edit/${activeUserID}`)
                          }}
                        >
                          Select Profile Picture
                        </Button>
                      )}
                    </Grid>
                    <Grid
                      item
                      md={8}
                      xs={12}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Typography fontWeight={700} variant='h2'>
                          {userInfo.username}
                        </Typography>
                        <Typography variant='subtitle2'>
                          {`Joined ${moment
                            .duration(userInfo.userCreatedAt - Date.now())
                            .humanize(true)}`}
                        </Typography>
                        {userInfo.bio && (
                          <div>
                            <Divider />
                            <Typography variant='body2' fontStyle='italic'>
                              {userInfo.bio}
                            </Typography>
                          </div>
                        )}
                        {activeUserID === userID && !userInfo.bio && (
                          <Button
                            color='primary'
                            variant='contained'
                            component='span'
                            onClick={() => {
                              navigate(`/user/edit/${activeUserID}`)
                            }}
                          >
                            Add Bio
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
                <PostFeed
                  posts={posts}
                  activeUserID={activeUserID}
                  onPostReaction={onPostReaction}
                />
              </Grid>
            )}
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default ProfileView
