// Third party
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import React from 'react'
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
import { REACT_APP_API_URL } from '../config'

function Home() {
  const [posts, setPosts] = React.useState([] as PostCardProps[])
  const [hasMore, setHasMore] = React.useState(true)
  const [activeUserID, setActiveUserID] = React.useState('')
  const [hasError, setHasError] = React.useState(false)

  const getPosts = async () => {
    try {
      return await apiHandler({
        refreshToken: false,
        apiCall: async () => {
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
        },
        onError: ({ error }: any) => {
          setHasError(true)
        }
      })
    } catch (err: any) {
      console.error(
        'An error occurred while calling apiHandler',
        'Home - getPosts'
      )
    }
  }

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
          },
          onError: () => {
            console.log('Not logged in. Viewing in guest mode.')
          }
        })
      } catch (err: any) {
        console.error(
          'An error occurred while calling apiHandler',
          'Home - getActiveUserID'
        )
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
    if (hasMore && posts.length > 0 && !hasError) {
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
                {hasError && (
                  <Typography variant='h6' color='error'>
                    An error has occurred. Please try again later.
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
                {hasMore && !hasError && <CircularProgress />}
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Home
