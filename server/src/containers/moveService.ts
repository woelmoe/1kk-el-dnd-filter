import { leftContainer, rightContainer } from './containers'

export const moveService = {
  addToLeft(id: number): {
    added: boolean
    position?: number
    reason?: string
  } {
    if (leftContainer.has(id)) {
      return { added: false, reason: 'already in left' }
    }
    if (rightContainer.has(id)) {
      return { added: false, reason: 'already in right' }
    }

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

  setRightOrder(visibleOrder: number[]) {
    const patches = new Map<number, number>()

    for (const id of visibleOrder) {
      const pos = rightContainer.findPosition(id)
      if (pos !== undefined) {
        patches.set(pos, id)
      }
    }

    if (patches.size !== visibleOrder.length) {
      console.log('setRightOrder: length mismatch!', {
        expected: patches.size,
        got: visibleOrder.length
      })
      return
    }

    rightContainer.applyPatches(patches)
  }
}
