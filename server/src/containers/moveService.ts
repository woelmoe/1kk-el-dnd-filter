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
    const positions: number[] = []
    for (const id of visibleOrder) {
      const pos = rightContainer.findPosition(id)
      if (pos !== undefined) positions.push(pos)
    }

    if (positions.length !== visibleOrder.length) {
      console.log('setRightOrder: length mismatch', {
        expected: positions.length,
        got: visibleOrder.length
      })
      return
    }

    positions.sort((a, b) => a - b)

    const patches = new Map<number, number>()
    for (let i = 0; i < positions.length; i++) {
      patches.set(positions[i], visibleOrder[i])
    }

    rightContainer.applyPatches(patches)
  }
}
