export function parseFilter(raw: string): number[] {
  const trimmed = raw.trim()
  if (trimmed === '') return []

  return trimmed
    .split(/\s+/)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1)
}

export function filterIds(source: readonly number[], ids: number[]): number[] {
  // todo: проверить падение при большом количестве элементов
  if (ids.length === 0) return [...source]

  const set = new Set(ids)
  return source.filter((id) => set.has(id))
}
