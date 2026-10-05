import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import { useQueryClient } from '@tanstack/react-query'
import { addToRight, removeFromRight, updateRightOrder } from '../../api/api'
import { ContainerType, type IDragData, type IDropData } from '../types'
import { QueryKeys } from '../../api/types'

interface IOptions {
  rightItems: number[]
  rightQueryKey: [string, string]
}

export function useCrossContainerDnd({ rightItems, rightQueryKey }: IOptions) {
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const from = (active.data.current as IDragData | undefined)?.container
    const to = (over.data.current as IDropData | undefined)?.container

    if (!from || !to) return

    const activeId = Number(active.id)
    const overId = Number(over.id)

    if (from === ContainerType.Left && to === ContainerType.Right) {
      addToRight(activeId).then(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Left] })
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
      })
      return
    }

    if (from === ContainerType.Right && to === ContainerType.Left) {
      removeFromRight(activeId).then(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Left] })
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
      })
      return
    }

    if (from === ContainerType.Right && to === ContainerType.Right) {
      if (activeId === overId) return

      const oldIndex = rightItems.indexOf(activeId)
      const newIndex = rightItems.indexOf(overId)
      if (oldIndex === -1 || newIndex === -1) return

      const newOrder = [...rightItems]
      newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, activeId)

      queryClient.setQueryData(rightQueryKey, (data: any) => {
        if (!data) return data
        return {
          ...data,
          pages: data.pages.map((page: any, i: number) => ({
            ...page,
            items: i === 0 ? newOrder : page.items
          }))
        }
      })

      updateRightOrder(newOrder).catch(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
      })
      return
    }
  }

  return { sensors, handleDragEnd }
}
