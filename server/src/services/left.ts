import { BatchQueue } from '@src/batchQueue'
import { moveService } from '@src/containers/moveService'
import { leftContainer, rightContainer } from '@src/containers/containers'
import { broadcast } from '@src/events'

const addQueue = new BatchQueue<{ id: number }>({
  name: 'left-add',
  intervalMs: 10_000,
  maxSize: 5_000,
  flushHandler: (batch) => {
    const added: number[] = []

    for (const { id } of batch) {
      const result = moveService.addToLeft(id)
      if (result.added) {
        added.push(id)
      }
    }

    if (added.length > 0) {
      broadcast('selected:changed', { added })
    }
  },
  deduplicationKey: (p) => String(p.id)
})

export function queueAddToLeft(id: number): boolean {
  if (leftContainer.has(id)) return false
  if (rightContainer.has(id)) return false

  addQueue.enqueue({ id })
  return true
}

export function getLeftQueuesStats() {
  return {
    add: { pending: addQueue.size(), stats: addQueue.getStats() }
  }
}

export async function flushLeftQueues() {
  await addQueue.forceFlush()
}
