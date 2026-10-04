type Handler<T> = (batch: T[]) => Promise<void> | void

export interface IBatchQueueStats {
  enqueued: number
  processed: number
  dropped: number
  failedBatches: number
  lastError?: string
  lastErrorAt?: number
}

export interface IBatchQueueOptions<T> {
  name: string
  intervalMs: number
  flushHandler: Handler<T>
  deduplicationKey: (item: T) => string
  maxSize?: number
}

export class BatchQueue<T> {
  private readonly name: string
  private readonly intervalMs: number
  private readonly maxSize: number
  private readonly flushHandler: Handler<T>
  private readonly deduplicationKey: (item: T) => string

  private pendingBatch = new Map<string, T>()
  private timer: NodeJS.Timeout | null = null
  private flushing = false

  private stats: IBatchQueueStats = {
    enqueued: 0,
    processed: 0,
    dropped: 0,
    failedBatches: 0
  }

  constructor(options: IBatchQueueOptions<T>) {
    this.name = options.name
    this.intervalMs = options.intervalMs
    this.maxSize = options.maxSize ?? Infinity
    this.flushHandler = options.flushHandler
    this.deduplicationKey = options.deduplicationKey
  }

  enqueue(item: T) {
    this.pendingBatch.set(this.deduplicationKey(item), item)
    this.stats.enqueued++

    if (this.pendingBatch.size >= this.maxSize) {
      void this.flush()
      return
    }

    this.scheduleFlush()
  }

  size() {
    return this.pendingBatch.size
  }

  getStats(): Readonly<IBatchQueueStats> {
    return { ...this.stats }
  }

  async forceFlush() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    await this.flush()
  }

  private scheduleFlush() {
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.timer = null
      void this.flush()
    }, this.intervalMs)
  }

  private async flush() {
    if (this.flushing) {
      if (this.pendingBatch.size > 0) this.scheduleFlush()
      return
    }
    if (this.pendingBatch.size === 0) return

    this.flushing = true

    const batch = [...this.pendingBatch.values()]
    this.pendingBatch.clear()

    const startedAt = Date.now()

    try {
      await this.flushHandler(batch)
      this.stats.processed += batch.length

      console.log('batch flushed', {
        queue: this.name,
        size: batch.length,
        ms: Date.now() - startedAt
      })
    } catch (err) {
      this.stats.failedBatches++
      this.stats.dropped += batch.length
      this.stats.lastError = err instanceof Error ? err.message : String(err)
      this.stats.lastErrorAt = Date.now()

      this.logBatchLoss(batch, err)
    } finally {
      this.flushing = false
      if (this.pendingBatch.size > 0) this.scheduleFlush()
    }
  }

  // я решил не усложнять код и просто вывел в лог потерянные данные в случае ошибок
  private logBatchLoss(batch: T[], err: unknown) {
    const keys = batch.map((item) => this.deduplicationKey(item))
    const MAX_KEYS_IN_LOG = 50
    const shownKeys = keys.slice(0, MAX_KEYS_IN_LOG)
    const truncated = keys.length > MAX_KEYS_IN_LOG

    console.error('batch lost', {
      queue: this.name,
      count: batch.length,
      keys: shownKeys,
      truncated,
      pendingAfterFailure: this.pendingBatch.size,
      totalDropped: this.stats.dropped,
      failedBatches: this.stats.failedBatches,
      error:
        err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack }
          : String(err)
    })
  }
}
