// Third party
import axios from 'axios'
import Cookies from 'js-cookie'
import { Editor } from '@tinymce/tinymce-react'

// Local
import { apiHandler } from '../utils/apiHandler'

// Configurations
import { REACT_APP_API_URL, REACT_APP_STATIC_URL } from '../config'

const TinyEditor = ({ innerRef, initialValue = '', onEditorChange }: any) => {
  return (
    <Editor
      // Files here need to have a recursive, public ACL
      // s3cmd setacl $REACT_APP_STATIC_URL/tinymce --acl-public --recursive
      tinymceScriptSrc={`${REACT_APP_STATIC_URL}/tinymce/js/tinymce/tinymce.min.js`}
      onInit={(evt, editor) => (innerRef.current = editor)}
      initialValue={initialValue}
      onEditorChange={onEditorChange}
      init={{
        skin: 'oxide-dark',
        content_css: 'dark',
        menubar: false,
        plugins: ['autoresize', 'image', 'lists', 'media', 'link'],
        toolbar:
          'undo redo | styles | nonsense | bold italic strikethrough underline | ' +
          'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
          'outdent indent | link image media',
        content_style:
          'body { font-family: Roboto, Helvetica, Arial, sans-serif; font-size:14px; } ' +
          'img { max-width: 100% !important }',
        media_dimensions: false,
        remove_linebreaks: true,
        mobile: {
          toolbar_mode: 'floating'
        },
        audio_template_callback: function (data: any) {
          return (
            '<p style="text-align: center"><audio controls src="' +
            data.source +
            '"></audio></p>'
          )
        },
        video_template_callback: function (data: any) {
          return (
            '<div class="static-video-container" style="text-align: center">' +
            '<video controls style="width: 100%; max-height: 100%;" src="' +
            data.source +
            '"' +
            (data.poster ? ' poster="' + data.poster + '"' : '') +
            '></video>' +
            '</div>'
          )
        },
        media_url_resolver: function (data: any, resolve: any, reject: any) {
          if (data.url.indexOf(REACT_APP_STATIC_URL) !== -1) {
            resolve({
              html: '' // Fallback to default handler if the URL is from our static resource domain
            })
          } else if (
            data.url.indexOf('youtu.be') !== -1 ||
            data.url.indexOf('youtube.com') !== -1
          ) {
            const youtubeRegex =
              /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
            const youtubeMatch = data.url.match(youtubeRegex)
            const youtubeVideoID = youtubeMatch[6]
            if (youtubeMatch) {
              const embedHtml =
                '<div class="responsive-video-container" style="text-align: center">' +
                '<iframe ' +
                `src="https://www.youtube.com/embed/${youtubeVideoID}" ` +
                'title="YouTube video player" ' +
                'frameborder="0" ' +
                'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                'allowfullscreen ' +
                '></iframe>' +
                '</div>'
              resolve({ html: embedHtml })
            }
          } else {
            reject({ msg: 'Domain source not allowed' })
          }
        },
        file_picker_types: 'image media',
        file_picker_callback: function (callback, value, meta) {
          try {
            const input = document.createElement('input') as any
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/* video/* audio/*')
            input.onchange = function () {
              const file = this.files[0]
              const reader = new FileReader()
              reader.onload = async function () {
                try {
                  await apiHandler({
                    apiCall: async () => {
                      innerRef.current.dom.doc.mostRecentWindow.block(
                        'Uploading file...'
                      )
                      const fd = new FormData()
                      fd.append('media', file)
                      fd.append('csrfToken', Cookies.get('csrfToken') as string)
                      const response: any = await axios({
                        method: 'post',
                        url: `${REACT_APP_API_URL}/api/media/upload`,
                        data: fd,
                        withCredentials: true
                      })
                      innerRef.current.dom.doc.mostRecentWindow.unblock()
                      callback(response.data.file.location, {
                        title: response.data.file.originalname
                      })
                    },
                    onError: () => {
                      console.error(
                        'Unable to upload file, please try again later.'
                      )
                    }
                  })
                } catch (err: any) {
                  console.error(
                    'An error occurred while calling apiHandler',
                    'tinyEditor - file_picker_callback'
                  )
                  innerRef.current.dom.doc.mostRecentWindow.unblock()
                }
              }
              reader.readAsDataURL(file)
            }
            input.click()
          } catch (err: any) {
            console.error('File selection failed')
          }
        },
        image_dimensions: false,
        setup: function (editor) {
          // Remove the 'Embed' and 'Advanced' media menu items
          editor.on('ExecCommand', (event) => {
            const command = event.command
            if (command === 'mceMedia') {
              const tabElems = document.querySelectorAll(
                'div[role="tablist"] .tox-tab'
              )
              tabElems.forEach((tabElem) => {
                if (
                  (tabElem as HTMLElement).innerText == 'Embed' ||
                  (tabElem as HTMLElement).innerText == 'Advanced'
                ) {
                  ;(tabElem as HTMLElement).remove()
                }
              })
            }
          }),
            editor.on('OpenWindow', (event) => {
              innerRef.current.dom.doc.mostRecentWindow = event.dialog
            })
        }
      }}
    />
  )
}

export default TinyEditor
