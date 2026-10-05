import type { Express } from 'express'
import {
  queueAddToRight,
  queueRemoveFromRight,
  queueSetRightOrder
} from '@src/services/right'
import { isValidId } from '@src/utils/validation'

function parseId(raw: string): number | null {
  const id = Number(raw)
  return isValidId(id) ? id : null
}

export function controllersRight(app: Express) {
  app.post('/api/right', (req, res) => {
    const id = Number(req.body?.id)
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }

    const queued = queueAddToRight(id)
    if (!queued) {
      return res.status(409).json({ error: 'cannot queue', id })
    }

    res.status(202).json({ queued: true, id })
  })

  app.delete('/api/right/:id', (req, res) => {
    const id = parseId(req.params.id)
    if (id === null) {
      return res.status(400).json({ error: 'invalid id' })
    }

    const queued = queueRemoveFromRight(id)
    if (!queued) {
      return res.status(409).json({ error: 'cannot queue', id })
    }

    res.status(202).json({ queued: true, id })
  })

  app.patch('/api/right', (req, res) => {
    const order = req.body?.order

    if (!Array.isArray(order) || !order.every(Number.isInteger)) {
      return res.status(400).json({ error: 'invalid order' })
    }

    queueSetRightOrder(order)
    res.status(202).json({ queued: true })
  })
}
