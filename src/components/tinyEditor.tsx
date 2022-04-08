// Third party
import axios from 'axios'
import Cookies from 'js-cookie'
import { Editor } from '@tinymce/tinymce-react'

// Local
import { apiHandler } from '../utils/apiHandler'

// Configurations
import { REACT_APP_API_URL, REACT_APP_STATIC_URL } from '../config'

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
        plugins: ['autoresize', 'image', 'lists', 'media'],
        toolbar:
          'undo redo | styles | nonsense | bold italic strikethrough underline | ' +
          'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
          'outdent indent | image media',
        content_style:
          'body { font-family:Roboto,Helvetica,Arial,sans-serif; font-size:14px } ' +
          'img { max-width: 100% !important }',
        media_dimensions: false,
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
        },
        image_dimensions: false,
        // Remove/disable the 'Embed' and 'Advanced' media menu items
        setup: function (editor) {
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
          })
        }
      }}
    />
  )
}

export default TinyEditor
