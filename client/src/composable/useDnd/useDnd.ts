import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import {
  addToRight,
  removeFromRight,
  updateRightOrder,
  type IPage
} from '../../api/api'
import { QueryKeys } from '../../api/types'
import { ContainerType, type IDragData, type IDropData } from '../types'

interface IOptions {
  rightItems: number[]
  rightQueryKey: [string, string]
}

function removeFromCache(queryClient: QueryClient, key: QueryKeys, id: number) {
  queryClient.setQueriesData({ queryKey: [key] }, (data: any) => {
    if (!data?.pages) return data
    return {
      ...data,
      pages: data.pages.map((page: IPage) => ({
        ...page,
        items: page.items.filter((x) => x !== id)
      }))
    }
  })
}

function insertToCache(
  queryClient: QueryClient,
  key: QueryKeys,
  id: number,
  beforeId: number | undefined,
  sorted: boolean
) {
  queryClient.setQueriesData({ queryKey: [key] }, (data: any) => {
    if (!data?.pages) return data
    return {
      ...data,
      pages: data.pages.map((page: IPage, i: number) => {
        if (i !== 0) return page
        const arr = [...page.items]

        if (beforeId !== undefined) {
          const idx = arr.indexOf(beforeId)
          if (idx !== -1) {
            arr.splice(idx, 0, id)
            return { ...page, items: arr }
          }
        }

        arr.push(id)
        return {
          ...page,
          items: sorted ? arr.sort((a, b) => a - b) : arr
        }
      })
    }
  })
}

function moveLeftToRight(
  queryClient: QueryClient,
  id: number,
  beforeId: number | undefined
) {
  removeFromCache(queryClient, QueryKeys.Left, id)
  insertToCache(queryClient, QueryKeys.Right, id, beforeId, false)

  addToRight(id, beforeId).catch(() => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Left] })
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
  })
}

function moveRightToLeft(queryClient: QueryClient, id: number) {
  removeFromCache(queryClient, QueryKeys.Right, id)
  insertToCache(queryClient, QueryKeys.Left, id, undefined, true)

  removeFromRight(id).catch(() => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Left] })
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
  })
}

function reorderRight(
  queryClient: QueryClient,
  rightItems: number[],
  rightQueryKey: [string, string],
  activeId: number,
  overId: number
) {
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
      pages: data.pages.map((page: IPage, i: number) => ({
        ...page,
        items: i === 0 ? newOrder : page.items
      }))
    }
  })

  updateRightOrder(newOrder).catch(() => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
  })
}

export function useDnd({ rightItems, rightQueryKey }: IOptions) {
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
      const beforeId =
        Number.isFinite(overId) && overId !== activeId ? overId : undefined
      moveLeftToRight(queryClient, activeId, beforeId)
      return
    }

    if (from === ContainerType.Right && to === ContainerType.Left) {
      moveRightToLeft(queryClient, activeId)
      return
    }

    if (from === ContainerType.Right && to === ContainerType.Right) {
      reorderRight(queryClient, rightItems, rightQueryKey, activeId, overId)
      return
    }
  }

  return { sensors, handleDragEnd }
}
