const ENVIRONMENT = process.env.NODE_ENV || 'development'
const API_URL = process.env.API_URL || 'http://localhost:3001'
const AUTH_URL = process.env.AUTH_URL || 'http://localhost:3000'
const PORT = process.env.PORT || 3002

export { ENVIRONMENT, API_URL, AUTH_URL, PORT }
