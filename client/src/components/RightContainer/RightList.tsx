import { Box, ListItemButton, ListItemText, CircularProgress, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeFromRight } from '../../api'

interface IProps {
  parentRef: React.RefObject<HTMLDivElement | null>
  virtualizer: Virtualizer<HTMLDivElement, Element>
  items: number[]
  isFetchingNextPage: boolean
}

export function RightList({
  parentRef,
  virtualizer,
  items,
  isFetchingNextPage
}: IProps) {
  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: (id: number) => removeFromRight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['right'] })
      queryClient.invalidateQueries({ queryKey: ['left'] })
    }
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
              <ListItemButton disableRipple>
                <ListItemText primary={id} />
                <IconButton
                  edge='end'
                  size='small'
                  onClick={() => removeMutation.mutate(id)}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
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