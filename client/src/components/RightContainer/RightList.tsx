import { Box, CircularProgress } from '@mui/material'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ContainerType, type IDropData } from '../../composable/types'
import { SortableRow } from './SortableRow'

interface IProps {
  parentRef: React.RefObject<HTMLDivElement | null>
  virtualizer: Virtualizer<HTMLDivElement, Element>
  items: number[]
  isFetchingNextPage: boolean
  rowHeight: number
}

export function RightList({
  parentRef,
  virtualizer,
  items,
  isFetchingNextPage,
  rowHeight
}: IProps) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: 'right-list',
    data: { container: ContainerType.Right } satisfies IDropData
  })

  return (
    <Box
      ref={parentRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflowX: 'hidden',
        minHeight: 0
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div
          ref={setDroppableRef}
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
                  height: rowHeight,
                  transform: `translateY(${vi.start}px)`
                }}
              >
                <SortableRow id={id} rowHeight={rowHeight} />
              </div>
            )
          })}
        </div>
      </SortableContext>

      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  )
}
