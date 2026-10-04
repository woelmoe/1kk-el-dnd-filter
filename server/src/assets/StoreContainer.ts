export class StoreContainer {
  private ids = new Set<number>()
  private array: number[] = []
  private idToPosition: Map<number, number> | null = null

  init(size: number) {
    if (this.ids.size > 0) {
      throw new Error('Container already initialized')
    }

    for (let i = 1; i <= size; i++) {
      this.ids.add(i)
      this.array.push(i)
    }

    this.idToPosition = null
  }

  has(id: number) {
    return this.ids.has(id)
  }

  count(): number {
    return this.ids.size
  }

  getArray(): readonly number[] {
    return this.array
  }

  findPosition(id: number): number | undefined {
    if (this.idToPosition === null) {
      this.rebuildIndex()
    }
    return this.idToPosition!.get(id)
  }

  applyPatches(patches: Map<number, number>) {
    if (this.idToPosition === null) {
      for (const [index, value] of patches) {
        this.array[index] = value
      }
      return
    }

    for (const [index, value] of patches) {
      const oldValue = this.array[index]
      this.idToPosition.delete(oldValue)
      this.array[index] = value
      this.idToPosition.set(value, index)
    }
  }

  push(id: number): void {
    if (this.ids.has(id)) return
    this.ids.add(id)
    this.array.push(id)
    this.idToPosition = null
  }

  remove(id: number): boolean {
    if (!this.ids.has(id)) return false
    this.ids.delete(id)
    const idx = this.array.indexOf(id)
    if (idx !== -1) {
      this.array.splice(idx, 1)
    }
    this.idToPosition = null
    return true
  }

  setOrder(next: number[]): number[] {
    const valid = next.filter((id) => this.ids.has(id))
    this.array = valid
    this.idToPosition = null
    return valid
  }

  private rebuildIndex(): void {
    const index = new Map<number, number>()
    for (let i = 0; i < this.array.length; i++) {
      index.set(this.array[i], i)
    }
    this.idToPosition = index
  }
}
