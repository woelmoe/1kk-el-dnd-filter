import { isValidId } from '@src/utils/validation'
import { getContainerState, type IContainerState } from './state'
import { moveService } from '@src/containers/moveService'

export interface AddResult extends IContainerState {
  added: boolean
  reason?: string
  position?: number
}

export interface MoveResult extends IContainerState {
  moved: boolean
}

export interface ValidationError {
  error: string
}

export function parseId(raw: string): number | ValidationError {
  const id = Number(raw)
  if (!isValidId(id)) {
    return { error: 'invalid id' }
  }
  return id
}

export function isValidationError(value: unknown): value is ValidationError {
  return typeof value === 'object' && value !== null && 'error' in value
}

function tryAddToLeft(id: number) {
  const result = moveService.addToLeft(id)

  if (!result.added) {
    console.log(`${id} not added: ${result.reason}`)
  }

  return result
}

export function addToLeft(id: number): AddResult {
  const result = tryAddToLeft(id)
  return {
    ...result,
    ...getContainerState()
  }
}

export function moveToRight(id: number): MoveResult {
  const moved = moveService.addToRight(id)
  return {
    moved,
    ...getContainerState()
  }
}

export function moveToLeft(id: number): MoveResult {
  const result = tryAddToLeft(id)
  return {
    moved: result.added,
    ...getContainerState()
  }
}

export function getDebugState(): IContainerState {
  return getContainerState()
}
