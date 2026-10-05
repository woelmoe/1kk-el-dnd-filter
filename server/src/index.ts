import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { controllersDebug } from './controllers/debug'
import { controllersEvents } from './controllers/events'
import { controllersItems } from './controllers/items'
import { controllersRight } from './controllers/right'
import { flushRightQueues } from './services/right'
import { controllersLeft } from './controllers/left'

const app = express()

app.use(cors())
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers.accept === 'text/event-stream') return false
      return compression.filter(req, res)
    }
  })
)
app.use(express.json())

controllersDebug(app)
controllersEvents(app)
controllersItems(app)
controllersLeft(app)
controllersRight(app)

const PORT = Number(process.env.PORT) || 4000

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

async function shutdown(signal: string) {
  console.log(`\n${signal} received, flushing queues...`)
  await flushRightQueues()
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
