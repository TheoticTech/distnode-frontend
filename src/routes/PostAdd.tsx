// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
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

// Constants
const ALLOWED_POST_TYPES = ['blog', 'link']

const PostAdd = () => {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [thumbnail, setThumbnail] = React.useState(null)
  const editorRef = React.useRef<any>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [postType, setPostType] = React.useState('blog')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const postType = searchParams.get('type') || ''
    if (!ALLOWED_POST_TYPES.includes(postType)) {
      navigate('/post/add/?type=blog')
    } else {
      setPostType(postType)
    }
  }, [searchParams])

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
        navigate('/auth/login', {
          state: { next: `/post/add/?type=${searchParams.get('type')}` }
        })
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
    setErrorMessage('')
    setLoading(true)

    postData.preventDefault()
    const data = new FormData(postData.currentTarget)

    try {
      if (postType === 'blog') {
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
                published: data.get('publish') === 'on',
                ...(thumbnail !== null && { thumbnail }),
                csrfToken: Cookies.get('csrfToken')
              },
              { withCredentials: true }
            )
            navigate('/')
          })
        }
      } else if (postType === 'link') {
        const link = data.get('link')
        if (!link) {
          setErrorMessage('Link URL must not be empty')
        } else {
          const prerenderResponse = await apiHandler(async () => {
            return await axios.get(
              `${REACT_APP_API_URL}/api/prerender?url=${link}`,
              { withCredentials: true }
            )
          })
          const prerenderData = prerenderResponse.data
          if (!prerenderData.title || !prerenderData.description) {
            setErrorMessage('Unable to prerender provided link')
          } else {
            const { title, description, image } = prerenderData
            return await apiHandler(async () => {
              await axios.post(
                `${REACT_APP_API_URL}/api/posts/add`,
                {
                  title,
                  description,
                  body: `<p><a href="${link}" target="_blank">${link}</a></p>`,
                  published: data.get('publish') === 'on',
                  ...(image !== null && { thumbnail: image }),
                  csrfToken: Cookies.get('csrfToken')
                },
                { withCredentials: true }
              )
              navigate('/')
            })
          }
        }
      }
    } catch (err: any) {
      if (err instanceof AuthError) {
        navigate('/auth/login')
      } else {
        const addPostError = err.response?.data?.addPostError
        const prerenderError = err.response?.data?.prerenderError
        if (addPostError) {
          setErrorMessage(addPostError)
        } else if (prerenderError) {
          setErrorMessage(prerenderError)
        } else {
          setErrorMessage(
            'An error occurred. Please ensure post is formed correctly, or try again later'
          )
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar activeUserID={activeUserID} />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Container component='main' maxWidth={'xl'}>
            <CssBaseline />
            {!loading && (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography component='h1' variant='h5'>
                  Create new {searchParams.get('type')} post
                </Typography>
                <Box
                  component='form'
                  onSubmit={addPost}
                  noValidate
                  sx={{ mt: 7, input: { color: 'white' } }}
                >
                  <Grid container spacing={2}>
                    {postType === 'blog' && (
                      <>
                        <Grid item xs={12}>
                          {thumbnail && (
                            <Grid item xs={12}>
                              <img
                                src={thumbnail}
                                style={{ maxWidth: '97%' }}
                              />
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
                      </>
                    )}
                    {postType === 'link' && (
                      <Grid item xs={12}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='link'
                          label='Link'
                          name='link'
                          placeholder='https://'
                          autoFocus
                        />
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={12}
                      sx={{ display: 'flex', justifyContent: 'right' }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              id='publish'
                              name='publish'
                            />
                          }
                          label='Publish'
                        />
                      </FormGroup>
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
            )}
            {loading && <CircularProgress />}
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
