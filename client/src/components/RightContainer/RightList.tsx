import { Box, CircularProgress } from '@mui/material'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { updateRightOrder, type IPage } from '../../api'
import { SortableRow } from './SortableRow'

interface IProps {
  parentRef: React.RefObject<HTMLDivElement | null>
  virtualizer: Virtualizer<HTMLDivElement, Element>
  items: number[]
  isFetchingNextPage: boolean
  queryKey: [string, string]
}

export function RightList({
  parentRef,
  virtualizer,
  items,
  isFetchingNextPage,
  queryKey
}: IProps) {
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const orderMutation = useMutation({
    mutationFn: (order: number[]) => updateRightOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['right'] })
    }
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.indexOf(Number(active.id))
    const newIndex = items.indexOf(Number(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = arrayMove(items, oldIndex, newIndex)

    queryClient.setQueryData(queryKey, (data: any) => {
      if (!data) return data
      return {
        ...data,
        pages: data.pages.map((page: IPage, i: number) => ({
          ...page,
          items: i === 0 ? newOrder : page.items
        }))
      }
    })

    orderMutation.mutate(newOrder)
  }

  return (
    <Box
      ref={parentRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minHeight: 0
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div
            style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
          >
            {virtualizer.getVirtualItems().map((vi) => {
              const id = items[vi.index]
              return (
                <div
                  key={id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${vi.start}px)`
                  }}
                >
                  <SortableRow id={id} />
                </div>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  )
}
