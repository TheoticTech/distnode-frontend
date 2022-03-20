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
import { REACT_APP_API_URL } from '../config'

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
      return await apiHandler(async () => {
        const result = await axios.post(
          `${REACT_APP_API_URL}/api/posts/create`,
          {
            title: data.get('title'),
            body: data.get('body'),
            visibility: 'public',
            csrfToken: Cookies.get('csrfToken')
          },
          { withCredentials: true }
        )
        navigate('/')
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
                    tinymceScriptSrc='https://distnode-cdn.sfo3.digitaloceanspaces.com/tinymce/js/tinymce/tinymce.min.js'
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue='<p>This is the initial content of the editor.</p>'
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'anchor',
                        'autolink',
                        'charmap',
                        'code',
                        'code',
                        'fullscreen',
                        'help',
                        'image',
                        'insertdatetime',
                        'link',
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
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | code | image | media | link | help',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      media_live_embeds: true,
                      file_picker_types: 'image media',
                      file_picker_callback: function (callback, value, meta) {
                        const input = document.createElement('input') as any
                        input.setAttribute('type', 'file')
                        input.setAttribute('accept', 'image/* video/* audio/*'),
                          (input.onchange = function () {
                            const file = this.files[0]
                            const reader = new FileReader()
                            reader.onload = function () {
                              const id = 'blobid' + new Date().getTime()
                              const blobCache =
                                tinymce.activeEditor.editorUpload.blobCache
                              const base64 = (reader.result as string).split(
                                ','
                              )[1]
                              const blobInfo = blobCache.create(
                                id,
                                file,
                                base64
                              )
                              blobCache.add(blobInfo)
                              callback(blobInfo.blobUri(), {
                                title: file.name
                              })
                            }
                            reader.readAsDataURL(file)
                          })
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
