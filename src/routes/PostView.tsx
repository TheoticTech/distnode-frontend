// Third party
import React from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import Grid from '@mui/material/Grid'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Paper from '@mui/material/Paper'
import ShareIcon from '@mui/icons-material/Share'
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router-dom'

// Local
import { apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import { PostCardProps } from '../types/PostCardProps'
import PostFeed from '../components/PostFeed'
import { react } from '../utils/react'
import '../style/base.css'

// Configurations
import {
  REACT_APP_API_URL,
  REACT_APP_AUTH_URL,
  REACT_APP_STATIC_URL
} from '../config'

function PostView({ helmetContext }: any) {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [authorInfo, setAuthorInfo] = React.useState({
    userID: '',
    username: '',
    createdAt: Date.now(),
    bio: '',
    avatar: ''
  })
  const [post, setPost] = React.useState({
    postID: '',
    createdAt: Date.now(),
    description: '',
    title: '',
    body: '',
    thumbnail: null,
    reaction: null
  })
  // Other posts from the same author
  const [authorPosts, setAuthorPosts] = React.useState([] as PostCardProps[])
  const [errorMessage, setErrorMessage] = React.useState('')
  const [postCardOptionsMenuEl, setPostCardOptionsMenuEl] =
    React.useState<null | HTMLElement>(null)
  const { postID } = useParams() // postID from URL
  const open = Boolean(postCardOptionsMenuEl)

  const handlePostCardOptionsMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setPostCardOptionsMenuEl(event.currentTarget)
  }
  const handlePostCardOptionsMenuButtonClose = () => {
    setPostCardOptionsMenuEl(null)
  }

  const confirmDeletePost = async (postID: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // First, ensure user has fresh CSRF token
        await axios.get(`${REACT_APP_AUTH_URL}/auth/refreshed-tokens`, {
          withCredentials: true
        })
        // Then, delete post
        await apiHandler(async () => {
          await axios.delete(
            `${REACT_APP_API_URL}/api/posts/delete/${postID}`,
            {
              data: {
                csrfToken: Cookies.get('csrfToken')
              },
              withCredentials: true
            }
          )
          navigate('/')
        })
      } catch (err: any) {
        const deletePostError = err.response?.data?.deletePostError
        if (deletePostError) {
          setErrorMessage(deletePostError)
        } else {
          setErrorMessage('An unknown error occurred, please try again later')
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

    const getPostData = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(
            `${REACT_APP_API_URL}/api/post/${postID}/`,
            {}
          )
          setAuthorInfo(data.user)
          setPost(data.post)
        })
      } catch (err: any) {
        const getPostError = err.response?.data?.getPostError
        if (getPostError && err.response?.status === 404) {
          setErrorMessage('Post not found.')
        } else {
          if (err.message) {
            setErrorMessage(err.message)
          } else {
            setErrorMessage(err)
          }
        }
      }
    }

    const getOtherAuthorPostsData = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(
            `${REACT_APP_API_URL}/api/post/${postID}/related/author`,
            {}
          )
          setAuthorPosts(data.posts)
        })
      } catch (err: any) {
        const getPostsError = err.response?.data?.getPostsError
        if (getPostsError && err.response?.status === 404) {
          setErrorMessage('Post not found.')
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
    getPostData()
    getOtherAuthorPostsData()
  }, [])

  const onPostReaction = ({ reactionType }: any) => {
    const newPost = { ...post, reaction: reactionType }
    setPost(newPost)
  }

  const onMorePostsReaction = ({ postID, reactionType }: any) => {
    const newPosts = authorPosts.map((post: PostCardProps) => {
      if (post.postID === postID) {
        return {
          ...post,
          reaction: reactionType
        }
      }
      return post
    })
    setAuthorPosts(newPosts)
  }

  return (
    <HelmetProvider context={helmetContext}>
      <Helmet>
        <title>{post.title}</title>
        <meta property='og:title' content={post.title} />
        <meta property='og:description' content={post.description} />
        {post.thumbnail && (
          <meta
            property='og:image'
            // Use HTTP for OG images
            content={(post.thumbnail as string).replace('https://', 'http://')}
          />
        )}
      </Helmet>
      <Navbar activeUserID={activeUserID} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container
            component='main'
            sx={{ justifyContent: 'center' }}
            maxWidth={'xl'}
          >
            <CssBaseline />
            {errorMessage && (
              <Typography variant='h6' color='error'>
                {errorMessage}
              </Typography>
            )}
            {!errorMessage && (
              <Grid>
                <Card sx={{ mt: 7, position: 'relative' }}>
                  <Grid
                    container
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Grid item md={4} xs={12}>
                      <Link href={`/user/view/${authorInfo.userID}`}>
                        <img
                          src={
                            authorInfo.avatar ||
                            `${REACT_APP_STATIC_URL}/resources/default-avatar.png`
                          }
                          style={{ width: '70%', borderRadius: '100%' }}
                        />
                      </Link>
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
                        <Link
                          href={`/user/view/${authorInfo.userID}`}
                          underline='hover'
                          variant='body1'
                          style={{
                            color: 'white'
                          }}
                        >
                          <Typography fontWeight={700} variant='h2'>
                            {authorInfo.username}
                          </Typography>
                        </Link>
                        <Typography variant='subtitle2'>
                          {`Joined ${moment
                            .duration(authorInfo.createdAt - Date.now())
                            .humanize(true)}`}
                        </Typography>
                        {authorInfo.bio && (
                          <div>
                            <Divider />
                            <Typography variant='body2' fontStyle='italic'>
                              {authorInfo.bio}
                            </Typography>
                          </div>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
                <Grid>
                  {post.thumbnail && (
                    <Grid item xs={12} sx={{ my: 7 }}>
                      <img src={post.thumbnail} style={{ maxWidth: '97%' }} />
                    </Grid>
                  )}
                  <Typography
                    variant='h2'
                    sx={{
                      mt: 7,
                      mb: 2,
                      fontWeight: 700,
                      textShadow: '4px 3px #000 !important'
                    }}
                  >
                    {post.title}
                  </Typography>
                </Grid>
                <Paper
                  elevation={2}
                  sx={{
                    position: 'relative',
                    color: 'white',
                    textAlign: 'initial'
                  }}
                >
                  {activeUserID === authorInfo.userID ? (
                    <Grid
                      sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px'
                      }}
                    >
                      <IconButton
                        onClick={handlePostCardOptionsMenuButtonClick}
                      >
                        <MoreVertIcon sx={{ color: 'white' }} />
                      </IconButton>
                      <Menu
                        id='post-card-options-menu'
                        anchorEl={postCardOptionsMenuEl}
                        open={open}
                        onClose={handlePostCardOptionsMenuButtonClose}
                      >
                        <MenuItem
                          onClick={() => {
                            handlePostCardOptionsMenuButtonClose()
                            navigate(`/post/edit/${postID}`)
                          }}
                        >
                          Edit Post
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => {
                            confirmDeletePost(parseInt(postID!))
                            handlePostCardOptionsMenuButtonClose()
                          }}
                          sx={{ color: 'red' }}
                        >
                          Delete Post
                        </MenuItem>
                      </Menu>
                    </Grid>
                  ) : null}
                  <div
                    dangerouslySetInnerHTML={{ __html: post.body }}
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '1.5rem',
                      padding: '1rem'
                    }}
                  />
                  <Grid
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      py: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {activeUserID && (
                      <>
                        <IconButton
                          onClick={async () => {
                            react({ postID, reactionType: 'Like' })
                            if (post.reaction === 'Like') {
                              onPostReaction({ postID })
                            } else {
                              onPostReaction({ postID, reactionType: 'Like' })
                            }
                          }}
                        >
                          <ThumbUpIcon
                            sx={
                              post.reaction !== 'Like'
                                ? {
                                    color: 'white',
                                    '&:hover': {
                                      color: '#4FC1F1'
                                    }
                                  }
                                : {
                                    color: '#4FC1F1'
                                  }
                            }
                          />
                        </IconButton>
                        <IconButton
                          onClick={async () => {
                            react({ postID, reactionType: 'Dislike' })
                            if (post.reaction === 'Dislike') {
                              onPostReaction({ postID })
                            } else {
                              onPostReaction({
                                postID,
                                reactionType: 'Dislike'
                              })
                            }
                          }}
                        >
                          <ThumbDownIcon
                            sx={
                              post.reaction !== 'Dislike'
                                ? {
                                    color: 'white',
                                    '&:hover': {
                                      color: 'red'
                                    }
                                  }
                                : {
                                    color: 'red'
                                  }
                            }
                          />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: `DistNode`,
                            text: `${post.title}: ${post.description}`,
                            url: `/post/view/${postID}`
                          })
                        } catch (err) {
                          console.error(err)
                        }
                      }}
                    >
                      <ShareIcon
                        sx={{
                          color: 'white',
                          '&:hover': {
                            color: '#4FC1F1'
                          }
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Paper>
                {authorPosts.length > 0 && (
                  <div>
                    <Typography variant='h3' sx={{ mt: '2em', mb: '1em' }}>
                      More posts from {authorInfo.username}:
                    </Typography>
                    <PostFeed
                      posts={authorPosts}
                      activeUserID={activeUserID}
                      onPostReaction={onMorePostsReaction}
                    />
                  </div>
                )}
              </Grid>
            )}
          </Container>
        </ThemeProvider>
      </div>
    </HelmetProvider>
  )
}

export default PostView
