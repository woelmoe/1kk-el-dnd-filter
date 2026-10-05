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

  addToRight(id: number, beforeId?: number): boolean {
    if (rightContainer.has(id)) return false
    if (!leftContainer.has(id)) return false

    leftContainer.remove(id)

    if (beforeId !== undefined) {
      const pos = rightContainer.findPosition(beforeId)
      if (pos !== undefined) {
        rightContainer.insertAt(id, pos)
        return true
      }
    }

    rightContainer.push(id)
    return true
  },

  removeFromRight(id: number): boolean {
    if (!rightContainer.has(id)) return false

    rightContainer.remove(id)
    leftContainer.push(id)
    return true
  },

  setRightOrder(visibleOrder: number[]) {
    console.log('setRightOrder', {
      visibleOrder,
      current: rightContainer.getOrder()
    })

    const positions: number[] = []
    for (const id of visibleOrder) {
      const pos = rightContainer.findPosition(id)
      console.log('findPosition', id, pos)
      if (pos !== undefined) positions.push(pos)
    }

    console.log('positions before sort', positions)
    positions.sort((a, b) => a - b)
    console.log('positions after sort', positions)

    if (positions.length !== visibleOrder.length) {
      console.log('setRightOrder: length mismatch', {
        expected: positions.length,
        got: visibleOrder.length
      })
      return
    }

    const patches = new Map<number, number>()
    for (let i = 0; i < positions.length; i++) {
      patches.set(positions[i], visibleOrder[i])
    }

    console.log('patches', [...patches.entries()])
    rightContainer.applyPatches(patches)
    console.log('after apply', rightContainer.getOrder())
  }
}
