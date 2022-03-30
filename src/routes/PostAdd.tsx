// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Cookies from 'js-cookie'
import CssBaseline from '@mui/material/CssBaseline'
import { Editor } from '@tinymce/tinymce-react'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
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

// TinyMCE scope
declare const tinymce: any

const PostAdd = () => {
  const navigate = useNavigate()
  const [activeUserID, setActiveUserID] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
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

  const postAdd = async (postData: React.FormEvent<HTMLFormElement>) => {
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
          <Container component='main'>
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
                onSubmit={postAdd}
                noValidate
                sx={{ input: { color: 'white' } }}
              >
                <Grid container spacing={1}>
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
                    <Editor
                      // Files here need to have a recursive, public ACL
                      // s3cmd setacl $REACT_APP_STATIC_URL/tinymce --acl-public --recursive
                      tinymceScriptSrc={`${REACT_APP_STATIC_URL}/tinymce/js/tinymce/tinymce.min.js`}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      initialValue=''
                      init={{
                        skin: 'oxide-dark',
                        content_css: 'dark',
                        menubar: false,
                        plugins: [
                          'advlist',
                          'anchor',
                          'autolink',
                          'charmap',
                          'fullscreen',
                          'image',
                          'insertdatetime',
                          'lists',
                          'media',
                          'preview',
                          'searchreplace',
                          'table',
                          'visualblocks',
                          'wordcount'
                        ],
                        toolbar:
                          'undo redo | formatselect | ' +
                          'bold italic strikethrough underline | backcolor | ' +
                          'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
                          'outdent indent | image media',
                        content_style:
                          'body { font-family:Roboto,Helvetica,Arial,sans-serif; font-size:14px }',
                        // paste_as_text: true, // uncomment to disable formatting on paste
                        audio_template_callback: function (data: any) {
                          return (
                            '<audio controls src="' + data.source + '"></audio>'
                          )
                        },
                        video_template_callback: function (data: any) {
                          return (
                            '<video controls src="' +
                            data.source +
                            '" width="' +
                            data.width +
                            '" height="' +
                            data.height +
                            '" ' +
                            (data.poster
                              ? ' poster="' + data.poster + '"'
                              : '') +
                            '></video>'
                          )
                        },
                        file_picker_types: 'image media',
                        file_picker_callback: async function (
                          callback,
                          value,
                          meta
                        ) {
                          const input = document.createElement('input') as any
                          input.setAttribute('type', 'file')
                          input.setAttribute(
                            'accept',
                            'image/* video/* audio/*'
                          )
                          input.onchange = function () {
                            const file = this.files[0]
                            const reader = new FileReader()
                            reader.onload = async function () {
                              await apiHandler(async () => {
                                const fd = new FormData()
                                fd.append('media', file)
                                fd.append(
                                  'csrfToken',
                                  Cookies.get('csrfToken') as string
                                )
                                const response: any = await axios({
                                  method: 'post',
                                  url: `${REACT_APP_API_URL}/api/media/upload`,
                                  data: fd,
                                  withCredentials: true
                                })
                                callback(response.data.file.location, {
                                  title: response.data.file.originalname
                                })
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                          input.click()
                        }
                      }}
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

export default PostAdd
