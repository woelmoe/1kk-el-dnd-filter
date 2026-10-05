export class OrderedContainer {
  private idSet = new Set<number>()
  private order: number[] = []
  private positionById: Map<number, number> | null = null

  constructor(size: number = 0) {
    if (size > 0) {
      for (let i = 1; i <= size; i++) {
        this.idSet.add(i)
        this.order.push(i)
      }
    }
  }

  has(id: number): boolean {
    return this.idSet.has(id)
  }

  count() {
    return this.idSet.size
  }

  getOrder(): readonly number[] {
    return this.order
  }

  findPosition(id: number): number | undefined {
    if (this.positionById === null) {
      this.rebuildIndex()
    }
    return this.positionById!.get(id)
  }

  push(id: number) {
    if (this.idSet.has(id)) return
    this.idSet.add(id)
    this.order.push(id)
    this.positionById = null
  }

  remove(id: number): boolean {
    if (!this.idSet.has(id)) return false
    this.idSet.delete(id)
    const idx = this.order.indexOf(id)
    if (idx !== -1) {
      this.order.splice(idx, 1)
    }
    this.positionById = null
    return true
  }

  applyPatches(patches: Map<number, number>) {
    if (this.positionById === null) {
      for (const [index, value] of patches) {
        this.order[index] = value
      }
      return
    }

    const oldValues: number[] = []
    for (const [index] of patches) {
      oldValues.push(this.order[index])
    }
    for (const value of oldValues) {
      this.positionById.delete(value)
    }

    for (const [index, value] of patches) {
      this.order[index] = value
      this.positionById.set(value, index)
    }
  }

  setOrder(next: number[]): number[] {
    const valid = next.filter((id) => this.idSet.has(id))
    this.order = valid
    this.positionById = null
    return valid
  }

  insertAt(id: number, position: number): void {
    if (this.idSet.has(id)) return

    this.idSet.add(id)
    this.order.splice(position, 0, id)
    this.positionById = null
  }

  private rebuildIndex() {
    const index = new Map<number, number>()
    for (let i = 0; i < this.order.length; i++) {
      index.set(this.order[i], i)
    }
    this.positionById = index
  }
}
