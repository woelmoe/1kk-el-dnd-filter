import { leftContainer, rightContainer } from './containers.js'

export const moveService = {
  addToLeft(id: number): {
    added: boolean
    position?: number
    reason?: string
  } {
    if (leftContainer.has(id))
      return { added: false, reason: 'already in left' }
    if (rightContainer.has(id))
      return { added: false, reason: 'already in right' }

    leftContainer.push(id)
    return { added: true, position: leftContainer.count() }
  },

  addToRight(id: number): boolean {
    if (rightContainer.has(id)) return false
    if (!leftContainer.has(id)) return false

    leftContainer.remove(id)
    rightContainer.push(id)
    return true
  },

  setRightOrder(next: number[]): number[] {
    return rightContainer.setOrder(next)
  }
}
