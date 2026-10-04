import { getLeft, getRight } from '@src/services/items'
import { parseFilter } from '@src/utils/filter'
import { parsePagination } from '@src/utils/pagination'
import type { Express } from 'express'

export function controllersItems(app: Express) {
  app.get('/api/left', (req, res) => {
    const filter = parseFilter(String(req.query.filter ?? ''))
    const { cursor, limit } = parsePagination(req.query)
    res.json(getLeft(filter, cursor, limit))
  })

  app.get('/api/right', (req, res) => {
    const filter = parseFilter(String(req.query.filter ?? ''))
    const { cursor, limit } = parsePagination(req.query)
    res.json(getRight(filter, cursor, limit))
  })
}
