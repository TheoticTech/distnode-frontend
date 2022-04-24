const REACT_APP_NAME = 'DistNode'
const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3001'
const REACT_APP_AUTH_URL =
  process.env.REACT_APP_AUTH_URL || 'http://localhost:3000'
const REACT_APP_STATIC_URL =
  process.env.REACT_APP_STATIC_URL ||
  'https://distnode-static-dev.sfo3.digitaloceanspaces.com'
const REACT_APP_GA_TAG = process.env.REACT_APP_GA_TAG || 'G-GJ2TTXWKXC'

export {
  REACT_APP_NAME,
  REACT_APP_API_URL,
  REACT_APP_AUTH_URL,
  REACT_APP_STATIC_URL,
  REACT_APP_GA_TAG
}
