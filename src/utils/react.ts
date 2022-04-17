// Local
import axios from 'axios'

// Local
import { apiHandler } from '../utils/apiHandler'
import { Reactions } from '../types/Reactions'

// Configurations
import { REACT_APP_API_URL } from '../config'

const react = async ({ postID, reactionType }: any) => {
  if (!Object.keys(Reactions).includes(reactionType)) {
    console.error('Invalid reaction type.')
  }
  return await apiHandler(async () => {
    await axios.post(
      `${REACT_APP_API_URL}/api/posts/${postID}/react`,
      {
        reaction: reactionType
      },
      { withCredentials: true }
    )
  })
}

export { react }
