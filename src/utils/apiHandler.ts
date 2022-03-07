// Third party
import axios from 'axios'

// Configurations
import { REACT_APP_AUTH_URL } from '../config'

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

const apiHandler = async (apiCall: any) => {
  try {
    return await apiCall()
  } catch (apiCallError: any) {
    const apiCallAuthError = apiCallError.response?.data?.authError
    const apiCallCSRFError = apiCallError.response?.data?.csrfError
    if (apiCallAuthError) {
      if (apiCallAuthError === 'Expired access token') {
        console.log('Access token has expired. Attempting to refresh now...')
        try {
          await axios.get(`${REACT_APP_AUTH_URL}/auth/refresh-tokens`, {
            withCredentials: true
          })
        } catch (refreshError: any) {
          throw new AuthError('Unable to refresh access token.')
        }

        return await apiCall()
      } else {
        throw new AuthError('Invalid or missing access token.')
      }
    } else if (apiCallCSRFError) {
      if (apiCallCSRFError === 'Expired CSRF token') {
        console.log('CSRF token has expired. Attempting to refresh now...')
        try {
          await axios.get(`${REACT_APP_AUTH_URL}/auth/refresh-tokens`, {
            withCredentials: true
          })
        } catch (refreshError: any) {
          throw new AuthError('Unable to refresh CSRF token.')
        }
        return await apiCall()
      } else {
        throw new AuthError('Invalid or missing CSRF token.')
      }
    } else {
      throw apiCallError
    }
  }
}

export { AuthError, apiHandler }
