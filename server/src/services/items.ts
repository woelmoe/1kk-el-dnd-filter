import type { OrderedContainer } from '@src/assets/OrderedContainer'
import { leftContainer, rightContainer } from '@src/containers/containers'
import { paginate, type IPage } from '@src/utils/pagination'

function getPage(
  container: OrderedContainer,
  filter: number[],
  cursor: number,
  limit: number
): IPage {
  if (filter.length === 0) {
    return paginate(container.getOrder(), cursor, limit)
  }

  const positionsSet = new Set<number>()
  for (const id of filter) {
    const pos = container.findPosition(id)
    if (pos !== undefined) {
      positionsSet.add(pos)
    }
  }

  const positions = [...positionsSet].sort((a, b) => a - b)

  const source = container.getOrder()
  const page = positions.slice(cursor, cursor + limit)
  const items = page.map((pos) => source[pos])

  return {
    items,
    nextCursor: cursor + page.length,
    hasMore: cursor + limit < positions.length
  }
}

export function getLeft(
  filter: number[],
  cursor: number,
  limit: number
): IPage {
  return getPage(leftContainer, filter, cursor, limit)
}

export function getRight(
  filter: number[],
  cursor: number,
  limit: number
): IPage {
  return getPage(rightContainer, filter, cursor, limit)
}
