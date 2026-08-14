import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import apiRoutes from './routes/index.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Silver GYM API',
  })
})

app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
