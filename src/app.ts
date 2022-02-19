// Standard library
import path from 'path'

// Third party
import express from 'express'

// Configurations
import { ENVIRONMENT, PORT } from './config'

console.log(`App starting in ${ENVIRONMENT} mode`)

const app = express()
// app.use(cookieParser())

app.use(express.static(path.join(__dirname, '..', 'dist/frontend')))
app.use(express.static('public'))

app.get('/health', (req, res): express.Response => {
    try {
        return res.status(200).send('OK')
    } catch (err) {
        return res.status(500).send('An error occurred')
    }
})

app.use('*', (req, res) => {
    return res.status(404).send('Route not found')
})

app.listen(PORT, () => {
    console.log('Server running at port:', PORT)
})
