export function isValidId(id: unknown): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0
}
