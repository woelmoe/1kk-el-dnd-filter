import { leftContainer, rightContainer } from '@src/containers/containers'
import { filterIds } from '@src/utils/filter'
import { paginate, type IPage } from '@src/utils/pagination'

export function getLeft(
  filter: number[],
  cursor: number,
  limit: number
): IPage {
  const filtered = filterIds(leftContainer.getArray(), filter)
  return paginate(filtered, cursor, limit)
}

export function getRight(
  filter: number[],
  cursor: number,
  limit: number
): IPage {
  const filtered = filterIds(rightContainer.getArray(), filter)
  return paginate(filtered, cursor, limit)
}
