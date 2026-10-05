import { useState } from 'react'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { useDnd } from './useDnd'

interface IOptions {
  rightItems: number[]
  rightQueryKey: [string, string]
}

export function useDndSetup({ rightItems, rightQueryKey }: IOptions) {
  const [activeId, setActiveId] = useState<number | null>(null)

  const { sensors, handleDragEnd } = useDnd({
    rightItems,
    rightQueryKey
  })

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id))
  }

  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event)
    setActiveId(null)
  }

  const onDragCancel = () => {
    setActiveId(null)
  }

  return {
    sensors,
    activeId,
    onDragStart,
    onDragEnd,
    onDragCancel
  }
}
