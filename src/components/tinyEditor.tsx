// Third party
import axios from 'axios'
import Cookies from 'js-cookie'
import { Editor } from '@tinymce/tinymce-react'

// Local
import { apiHandler } from '../utils/apiHandler'

// Configurations
import { REACT_APP_API_URL, REACT_APP_STATIC_URL } from '../config'

// TinyMCE scope
declare const tinymce: any

const TinyEditor = ({ innerRef, initialValue = '' }: any) => {
  return (
    <Editor
      // Files here need to have a recursive, public ACL
      // s3cmd setacl $REACT_APP_STATIC_URL/tinymce --acl-public --recursive
      tinymceScriptSrc={`${REACT_APP_STATIC_URL}/tinymce/js/tinymce/tinymce.min.js`}
      onInit={(evt, editor) => (innerRef.current = editor)}
      initialValue={initialValue}
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
        media_dimensions: false,
        // paste_as_text: true, // uncomment to disable formatting on paste
        audio_template_callback: function (data: any) {
          return (
            '<p style="text-align: center"><audio controls src="' +
            data.source +
            '"></audio></p>'
          )
        },
        video_template_callback: function (data: any) {
          return (
            '<p style="text-align: center"><video controls src="' +
            data.source +
            '"' +
            (data.poster ? ' poster="' + data.poster + '"' : '') +
            '></video></p>'
          )
        },
        file_picker_types: 'image media',
        file_picker_callback: async function (callback, value, meta) {
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
                fd.append('csrfToken', Cookies.get('csrfToken') as string)
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
  )
}

export default TinyEditor
