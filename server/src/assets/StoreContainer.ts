export class StoreContainer {
  private ids = new Set<number>()
  private array: number[] = []

  init(size: number) {
    if (this.ids.size > 0) {
      throw new Error('Container already initialized')
    }
    for (let i = 1; i <= size; i++) {
      this.ids.add(i)
      this.array.push(i)
    }
  }

  has(id: number) {
    return this.ids.has(id)
  }

  count() {
    return this.ids.size
  }

  getArray(): readonly number[] {
    return this.array
  }

  push(id: number) {
    if (this.ids.has(id)) return
    this.ids.add(id)
    this.array.push(id)
  }

  remove(id: number): boolean {
    if (!this.ids.has(id)) return false
    this.ids.delete(id)
    const idx = this.array.indexOf(id)
    if (idx !== -1) this.array.splice(idx, 1)
    return true
  }

  setOrder(next: number[]): number[] {
    const valid = next.filter((id) => this.ids.has(id))
    this.array = valid
    return valid
  }
}
