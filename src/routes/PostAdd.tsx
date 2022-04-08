// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'
import baseTheme from '../style/baseTheme'
import Navbar from '../components/Navbar'
import TinyEditor from '../components/tinyEditor'
import '../style/base.css'

// Configurations
import { REACT_APP_API_URL } from '../config'

const PostAdd = () => {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [thumbnail, setThumbnail] = React.useState(null)
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
        navigate('/auth/login', { state: { next: '/post/add' } })
      }
    }
    getActiveUserID()
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
        setThumbnail(response.data.file.location)
      })
    }
  }

  const addPost = async (postData: React.FormEvent<HTMLFormElement>) => {
    postData.preventDefault()
    const data = new FormData(postData.currentTarget)

    try {
      const content = editorRef.current.getContent()
      if (!content) {
        setErrorMessage('Post body must not be empty')
      } else {
        return await apiHandler(async () => {
          await axios.post(
            `${REACT_APP_API_URL}/api/posts/add`,
            {
              title: data.get('title'),
              description: data.get('description'),
              body: editorRef.current.getContent(),
              ...(thumbnail !== null && { thumbnail }),
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
                Create new post
              </Typography>
              <Box
                component='form'
                onSubmit={addPost}
                noValidate
                sx={{ mt: 7, input: { color: 'white' } }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {thumbnail && (
                      <Grid item xs={12}>
                        <img src={thumbnail} style={{ maxWidth: '97%' }} />
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TinyEditor innerRef={editorRef} />
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

export default PostAdd
