import type { Express } from 'express'
import {
  addToLeft,
  moveToRight,
  moveToLeft,
  getDebugState,
  parseId,
  isValidationError
} from '../services/debug'

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
}
