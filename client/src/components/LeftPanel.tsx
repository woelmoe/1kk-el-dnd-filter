import { Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LeftList } from './LeftList'
import { useFilters } from '../store/filter'
import { useDebouncedValue } from '../composable/useDebouncedValue'
import { useVirtualList } from '../composable/useVirtualList'
import { addToRight, getLeft } from '../api'
import { AddFab } from './AddFab'

export function LeftPanel() {
  const { leftFilter, setLeftFilter } = useFilters()
  const debouncedFilter = useDebouncedValue(leftFilter, 300)
  const queryClient = useQueryClient()

  const list = useVirtualList({
    queryKey: ['left', debouncedFilter],
    getPage: (cursor) => getLeft(debouncedFilter, cursor)
  })

  const addMutation = useMutation({
    mutationFn: (id: number) => addToRight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['left'] })
      queryClient.invalidateQueries({ queryKey: ['right'] })
    }
  })

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative' // ← для FAB
      }}
    >
      <Typography variant='h6' sx={{ mb: 1 }}>
        Все элементы
      </Typography>

      <Stack direction='row' spacing={1} sx={{ mb: 1.5 }}>
        <TextField
          size='small'
          fullWidth
          label='Фильтр по ID'
          placeholder='Формат: 1 3 43 100 ...'
          value={leftFilter}
          onChange={(e) => {
            const value = e.target.value
            if (/^[0-9\s]*$/.test(value)) {
              setLeftFilter(value)
            }
          }}
        />
      </Stack>

      <LeftList
        parentRef={list.parentRef}
        virtualizer={list.virtualizer}
        items={list.items}
        isFetchingNextPage={list.isFetchingNextPage}
        onSelect={(id) => addMutation.mutate(id)}
      />

      <AddFab />
    </Paper>
  )
}
