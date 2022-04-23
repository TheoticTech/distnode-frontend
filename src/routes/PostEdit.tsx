// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import TinyEditor from '../components/tinyEditor'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

const PostEdit = () => {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [post, setPost] = React.useState({
    postID: '',
    createdAt: Date.now(),
    description: '',
    title: '',
    body: '',
    thumbnail: null
  })
  const [errorMessage, setErrorMessage] = React.useState('')
  const { postID } = useParams() // postID from URL
  const editorRef = React.useRef<any>(null)

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
        navigate('/auth/login', { state: { next: `/post/edit/${postID}` } })
      }
    }

    const getPostData = async () => {
      try {
        return await apiHandler(async () => {
          const { data } = await axios.get(
            `${REACT_APP_API_URL}/api/post/${postID}/`,
            {}
          )
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

    getActiveUserID()
    getPostData()
  }, [])

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await apiHandler(async () => {
        const fd = new FormData()
        fd.append('media', e.target.files![0])
        fd.append('csrfToken', Cookies.get('csrfToken') as string)
        const response: any = await axios({
          method: 'post',
          url: `${REACT_APP_API_URL}/api/media/upload`,
          data: fd,
          withCredentials: true
        })
        setPost({ ...post, thumbnail: response.data.file.location })
      })
    }
  }

  const editPost = async (postData: React.FormEvent<HTMLFormElement>) => {
    postData.preventDefault()

    try {
      const content = editorRef.current.getContent()
      if (!content) {
        setErrorMessage('Post body must not be empty')
      } else {
        return await apiHandler(async () => {
          await axios.post(
            `${REACT_APP_API_URL}/api/posts/edit/${postID}`,
            {
              ...post,
              body: editorRef.current.getContent(),
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
        const editPostError = err.response?.data?.editPostError
        if (editPostError) {
          setErrorMessage(editPostError)
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
          <Container component='main' maxWidth={'xl'}>
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
                Edit post
              </Typography>
              <Box
                component='form'
                onSubmit={editPost}
                noValidate
                sx={{ mt: 7, input: { color: 'white' } }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {post.thumbnail && (
                      <Grid item xs={12}>
                        <img src={post.thumbnail} style={{ maxWidth: '97%' }} />
                      </Grid>
                    )}
                    <label htmlFor='uploadThumbnail'>
                      <input
                        style={{ display: 'none' }}
                        id='uploadThumbnail'
                        name='uploadThumbnail'
                        type='file'
                        onChange={onImageChange}
                      />
                      <Button
                        color='secondary'
                        variant='contained'
                        component='span'
                        sx={{ mt: 2 }}
                      >
                        Select Thumbnail Picture
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='title'
                      label='Title'
                      name='title'
                      value={post.title}
                      onChange={(e) =>
                        setPost({ ...post, title: e.target.value })
                      }
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      inputProps={{ style: { color: 'white' } }}
                      margin='normal'
                      multiline
                      minRows={3}
                      maxRows={4}
                      required
                      fullWidth
                      id='description'
                      label='Description'
                      name='description'
                      value={post.description}
                      onChange={(e) =>
                        setPost({ ...post, description: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TinyEditor innerRef={editorRef} initialValue={post.body} />
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

export default PostEdit
