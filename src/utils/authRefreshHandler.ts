// Third party
import axios from 'axios'

// Configurations
import { REACT_APP_AUTH_URL } from '../config'

// const authRefreshHandler = async () => {
//   await axios.get(`${REACT_APP_AUTH_URL}/auth/refresh`, {
//     withCredentials: true
//   })
// }

const authRefreshHandler = async (
  apiCall: any,
  errorHandler: any,
  parentNavigation: any
) => {
  try {
    return await apiCall()
  } catch (apiCallError: any) {
    const apiCallAuthError = apiCallError.response?.data?.authError
    if (apiCallAuthError) {
      if (apiCallAuthError === 'Expired access token') {
        console.log('Access token has expired. Attempting to refresh now...')
        try {
          await axios.get(`${REACT_APP_AUTH_URL}/auth/refresh`, {
            withCredentials: true
          })
        } catch (refreshError: any) {
          console.log('Should re-login')
          // parentNavigation('/auth/login')
        }
        try {
          return await apiCall()
        } catch (apiCallRetryError) {
          errorHandler(apiCallRetryError)
        }
      } else {
        console.log('Should re-login')
        // parentNavigation('/auth/login')
      }
    } else {
      errorHandler(apiCallError)
    }
  }
}

export default authRefreshHandler
