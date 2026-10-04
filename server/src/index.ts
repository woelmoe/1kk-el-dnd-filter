import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { controllersDebug } from './controllers/debug'

const app = express()

app.use(cors())
app.use(compression())
app.use(express.json())

controllersDebug(app)

const PORT = Number(process.env.PORT) || 4000

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
