import { isValidId } from '@src/utils/validation'
import { getContainerState, type IContainerState } from './state'
import { moveService } from '@src/containers/moveService'
import { broadcast } from '@src/events'

export interface IAddResult extends IContainerState {
  added: boolean
  reason?: string
  position?: number
}

export interface IMoveResult extends IContainerState {
  moved: boolean
}

export interface IValidationError {
  error: string
}

export function parseId(raw: string): number | IValidationError {
  const id = Number(raw)
  if (!isValidId(id)) {
    return { error: 'invalid id' }
  }
  return id
}

export function isValidationError(value: unknown): value is IValidationError {
  return typeof value === 'object' && value !== null && 'error' in value
}

function tryAddToLeft(id: number) {
  const result = moveService.addToLeft(id)

  if (!result.added) {
    console.log(`${id} not added: ${result.reason}`)
  }

  return result
}

export function addToLeft(id: number): IAddResult {
  const result = tryAddToLeft(id)
  return {
    ...result,
    ...getContainerState()
  }
}

export function moveToRight(id: number): IMoveResult {
  const moved = moveService.addToRight(id)
  return {
    moved,
    ...getContainerState()
  }
}

export function moveToLeft(id: number): IMoveResult {
  const moved = moveService.removeFromRight(id)
  return { moved, ...getContainerState() }
}

export function getDebugState(): IContainerState {
  return getContainerState()
}

export function broadcastTest() {
  broadcast('test:event', { test: 'events test', ts: Date.now() })
}
