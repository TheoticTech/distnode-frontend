// Third party
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { InView } from 'react-intersection-observer'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import PostFeed from '../components/PostFeed'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

// Interface for post data from API
interface Post {
  postID: number
  userID: number
  username: string
  avatar: string
  thumbnail: string
  title: string
  postCreatedAt: string
  description: string
}

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = React.useState([] as Post[])
  const [hasMore, setHasMore] = React.useState(true)
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  const getPosts = async () => {
    try {
      return await apiHandler(async () => {
        const { data } = await axios.post(`${REACT_APP_API_URL}/api/posts`, {
          currentPosts: posts.map((post: Post) => {
            return post.postID
          })
        })
        if (data.posts.length === 0) {
          setHasMore(false)
        } else {
          setPosts((currentPosts) => [...currentPosts, ...data.posts])
        }
      })
    } catch (err: any) {
      if (err instanceof AuthError) {
        navigate('/auth/login')
      } else {
        if (err.message) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage(err)
        }
      }
    }
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

    getPosts()
    getActiveUserID()
  }, [])

  return (
    <div>
      <Navbar activeUserID={activeUserID} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container
            component='main'
            maxWidth={'xl'}
            sx={{
              my: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CssBaseline />
            <Grid container spacing={1}>
              <Grid item xs={12}>
                {errorMessage && (
                  <Typography variant='h6' color='error'>
                    {errorMessage}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <PostFeed posts={posts} activeUserID={activeUserID} />
              </Grid>
              <Grid item xs={12}>
                <InView
                  as='div'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onChange={(inView: boolean) => {
                    if (posts.length > 0 && inView && hasMore) {
                      getPosts()
                    }
                  }}
                >
                  {hasMore && <CircularProgress />}
                </InView>
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Home
