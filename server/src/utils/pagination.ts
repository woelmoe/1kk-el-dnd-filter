export interface IPage {
  items: number[]
  nextCursor: number
  hasMore: boolean
}

export interface IQuery {
  filter?: unknown
  cursor?: unknown
  limit?: unknown
}

export function paginate(
  source: readonly number[],
  cursor: number,
  limit: number
): IPage {
  const end = Math.min(cursor + limit, source.length)

  return {
    items: source.slice(cursor, end),
    nextCursor: end,
    hasMore: end < source.length
  }
}

export function parsePagination(query: IQuery) {
  const rawCursor = Number(query.cursor ?? 0)
  const rawLimit = Number(query.limit ?? 20)

  return {
    cursor: Number.isInteger(rawCursor) && rawCursor >= 0 ? rawCursor : 0,
    limit:
      Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20
  }
}
