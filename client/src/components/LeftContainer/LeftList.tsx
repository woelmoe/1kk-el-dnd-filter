import {
  Box,
  ListItemButton,
  ListItemText,
  CircularProgress
} from '@mui/material'
import type { Virtualizer } from '@tanstack/react-virtual'

interface IProps {
  parentRef: React.RefObject<HTMLDivElement | null>
  virtualizer: Virtualizer<HTMLDivElement, Element>
  items: number[]
  isFetchingNextPage: boolean
  onSelect: (id: number) => void
}

export function LeftList({
  parentRef,
  virtualizer,
  items,
  isFetchingNextPage,
  onSelect
}: IProps) {
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
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
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
              <ListItemButton disableRipple onDoubleClick={() => onSelect(id)}>
                <ListItemText primary={id} />
              </ListItemButton>
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
