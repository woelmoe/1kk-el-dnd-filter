import { BatchQueue } from '@src/batchQueue'
import { moveService } from '@src/containers/moveService'
import { leftContainer, rightContainer } from '@src/containers/containers'
import { broadcast } from '@src/events'

const addQueue = new BatchQueue<{ id: number }>({
  name: 'add',
  intervalMs: 1_000,
  maxSize: 5_000,
  flushHandler: (batch) => {
    const added: number[] = []

    for (const { id } of batch) {
      if (moveService.addToRight(id)) {
        added.push(id)
      }
    }

    if (added.length > 0) {
      broadcast('selected:changed', { added })
    }
  },
  deduplicationKey: (p) => String(p.id)
})

const removeQueue = new BatchQueue<{ id: number }>({
  name: 'remove',
  intervalMs: 1_000,
  maxSize: 5_000,
  flushHandler: (batch) => {
    const removed: number[] = []

    for (const { id } of batch) {
      if (moveService.removeFromRight(id)) {
        removed.push(id)
      }
    }

    if (removed.length > 0) {
      broadcast('selected:changed', { removed })
    }
  },
  deduplicationKey: (p) => String(p.id)
})

const orderQueue = new BatchQueue<{ order: number[] }>({
  name: 'order',
  intervalMs: 1_000,
  maxSize: 5_000,
  flushHandler: (batch) => {
    console.log('orderQueue flush', batch)
    const last = batch[batch.length - 1]
    moveService.setRightOrder(last.order)
    broadcast('order:changed', {
      order: rightContainer.getOrder()
    })
  },
  deduplicationKey: () => 'order'
})

export function queueAddToRight(id: number): boolean {
  if (rightContainer.has(id)) return false
  if (!leftContainer.has(id)) return false

  addQueue.enqueue({ id })
  return true
}

export function queueRemoveFromRight(id: number): boolean {
  if (!rightContainer.has(id)) return false
  removeQueue.enqueue({ id })
  return true
}

export function queueSetRightOrder(order: number[]) {
  orderQueue.enqueue({ order })
}

export function getRightQueuesStats() {
  return {
    add: { pending: addQueue.size(), stats: addQueue.getStats() },
    remove: { pending: removeQueue.size(), stats: removeQueue.getStats() },
    order: { pending: orderQueue.size(), stats: orderQueue.getStats() }
  }
}

export async function flushRightQueues() {
  await Promise.all([
    addQueue.forceFlush(),
    removeQueue.forceFlush(),
    orderQueue.forceFlush()
  ])
}
