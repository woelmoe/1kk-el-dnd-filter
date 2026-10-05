import { Box, CircularProgress } from '@mui/material'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useDroppable } from '@dnd-kit/core'
import { ContainerType, type IDropData } from '../../composable/types'
import { DraggableRow } from './DraggableRow'

interface IProps {
  parentRef: React.RefObject<HTMLDivElement | null>
  virtualizer: Virtualizer<HTMLDivElement, Element>
  items: number[]
  isFetchingNextPage: boolean
  onDoubleClick: () => void
  rowHeight: number
}

export function LeftList({
  parentRef,
  virtualizer,
  items,
  isFetchingNextPage,
  onDoubleClick,
  rowHeight
}: IProps) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: 'left-list',
    data: { container: ContainerType.Left } satisfies IDropData
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
        minHeight: 0,
        overflowX: 'hidden',
        overscrollBehavior: 'contain'
      }}
    >
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
              <DraggableRow
                id={id}
                onDoubleClick={onDoubleClick}
                rowHeight={rowHeight}
              />
            </div>
          )
        })}
      </div>

      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  )
}
