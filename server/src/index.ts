import express from 'express'
import cors from 'cors'
import compression from 'compression'

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json())

const PORT = Number(process.env.PORT) || 4000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
