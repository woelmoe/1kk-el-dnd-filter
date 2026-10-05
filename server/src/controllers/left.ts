import type { Express } from 'express'
import { isValidId } from '@src/utils/validation'
import { queueAddToLeft } from '@src/services/left'

export function controllersLeft(app: Express) {
  // добавить элемент в левый контейнер
  app.post('/api/left', (req, res) => {
    const id = Number(req.body?.id)
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }

    const queued = queueAddToLeft(id)
    if (!queued) {
      return res.status(409).json({ error: 'cannot queue', id })
    }

    res.status(202).json({ queued: true, id })
  })
}
