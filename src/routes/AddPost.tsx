// Third party
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Cookies from 'js-cookie'
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

const AddPost = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')
  const editorRef = React.useRef<any>(null)
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
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
          const result = await axios.post(
            `${REACT_APP_API_URL}/api/posts/add`,
            {
              title: data.get('title'),
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
      <Navbar />
      <div className='App'>
        <ThemeProvider theme={baseTheme}>
          <Box
            sx={{
              marginTop: 8,
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
                  <Editor
                    // Files here need to have a recursive, public ACL
                    // s3cmd setacl $REACT_APP_STATIC_URL/tinymce --acl-public --recursive
                    tinymceScriptSrc={`${REACT_APP_STATIC_URL}/tinymce/js/tinymce/tinymce.min.js`}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue=''
                    init={{
                      height: 500,
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
                      media_live_embeds: true,
                      file_picker_types: 'image media',
                      file_picker_callback: async function (
                        callback,
                        value,
                        meta
                      ) {
                        const input = document.createElement('input') as any
                        input.setAttribute('type', 'file')
                        input.setAttribute('accept', 'image/* video/* audio/*')
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
                              console.log(response)
                              callback(response.data.file.location, {
                                title: response.data.file.originalname
                              })
                            })
                          }
                          reader.readAsDataURL(file)
                        }
                        input.click()
                      },
                      onChange: { log }
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
        </ThemeProvider>
      </div>
    </div>
  )
}

export default AddPost
