import type { Express } from 'express'
import {
  addToLeft,
  moveToRight,
  moveToLeft,
  getDebugState,
  parseId,
  isValidationError,
  broadcastTest
} from '../services/debug'
import { moveService } from '@src/containers/moveService'

export function controllersDebug(app: Express) {
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() })
  })

  app.get('/api/debug', (_req, res) => {
    res.json(getDebugState())
  })

  app.post('/api/debug/add/:id', (req, res) => {
    const id = parseId(req.params.id)
    if (isValidationError(id)) return res.status(400).json(id)

    res.json(addToLeft(id))
  })

  app.post('/api/debug/move-right/:id', (req, res) => {
    const id = parseId(req.params.id)
    if (isValidationError(id)) return res.status(400).json(id)

    res.json(moveToRight(id))
  })

  app.post('/api/debug/move-left/:id', (req, res) => {
    const id = parseId(req.params.id)
    if (isValidationError(id)) return res.status(400).json(id)

    res.json(moveToLeft(id))
  })

  app.post('/api/debug/broadcast-test', (_req, res) => {
    broadcastTest()
    res.json({ broadcasted: true })
  })

  app.post('/api/debug/set-order', (req, res) => {
    const { order } = req.body
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order must be array' })
    }
    moveService.setRightOrder(order)
    res.json({ ok: true })
  })
}
