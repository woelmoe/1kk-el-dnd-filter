import type { Express, Response } from 'express'
import { addClient } from '../events'

export function controllersEvents(app: Express) {
  // подписка на события через sse
  app.get('/api/events', (req, res: Response) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    })

    res.flushHeaders()
    addClient(res)
  })
}
