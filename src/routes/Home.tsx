// Third party
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import { PostCardProps } from '../types/PostCardProps'
import PostFeed from '../components/PostFeed'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = React.useState([] as PostCardProps[])
  const [hasMore, setHasMore] = React.useState(true)
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  const getPosts = async () => {
    try {
      return await apiHandler(async () => {
        const { data } = await axios.post(
          `${REACT_APP_API_URL}/api/posts`,
          {
            currentPosts: posts.map((post: PostCardProps) => {
              return post.postID
            })
          },
          { withCredentials: true }
        )
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

    getActiveUserID()
    getPosts()
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

  const onLastIsVisible = () => {
    if (hasMore && posts.length > 0 && !errorMessage) {
      getPosts()
    }
  }

  return (
    <div>
      <Navbar activeUserID={activeUserID} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container
            component='main'
            maxWidth={'xl'}
            sx={{
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
                <PostFeed
                  posts={posts}
                  activeUserID={activeUserID}
                  onPostReaction={onPostReaction}
                  onLastIsVisible={onLastIsVisible}
                />
              </Grid>
              <Grid item xs={12}>
                {hasMore && !errorMessage && <CircularProgress />}
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Home
