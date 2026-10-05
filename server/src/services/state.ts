import { leftContainer, rightContainer } from '@src/containers/containers'

export interface IContainerState {
  leftCount: number
  rightCount: number
}

export function getContainerState(): IContainerState {
  return {
    leftCount: leftContainer.count(),
    rightCount: rightContainer.count()
  }
}
