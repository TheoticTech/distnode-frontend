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

const apiHandler = async ({
  refreshToken = true,
  apiCall,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onError = () => {}
}: any) => {
  try {
    if (refreshToken) {
      await axios.get(`${REACT_APP_AUTH_URL}/auth/refreshed-tokens`, {
        withCredentials: true
      })
    }
    return await apiCall()
  } catch (err) {
    await onError({ error: err })
  }
}

export { AuthError, apiHandler }
