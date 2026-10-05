export function parseFilter(raw: string): number[] {
  const trimmed = raw.trim()
  if (trimmed === '') return []

  return trimmed
    .split(/\s+/)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1)
}
