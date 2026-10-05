import { useState } from 'react'
import { Paper, Stack, TextField, Typography } from '@mui/material'
import { useFilters } from '../../store/filter'
import { useDebouncedValue } from '../../composable/useDebouncedValue'
import { useVirtualList } from '../../composable/useVirtualList'
import { getLeft } from '../../api/api'
import { LeftList } from './LeftList'
import { AddFab } from '../AddFab'
import { AddIdModal } from '../AddIdModal'
import { QueryKeys } from '../../api/types'

export function LeftContainer() {
  const { leftFilter, setLeftFilter } = useFilters()
  const debouncedFilter = useDebouncedValue(leftFilter, 300)

  const [addModalOpen, setAddModalOpen] = useState(false)

  const list = useVirtualList({
    queryKey: [QueryKeys.Left, debouncedFilter],
    getPage: (cursor) => getLeft(debouncedFilter, cursor)
  })

  const handleFilterChange = (raw: string) => {
    if (/^[0-9\s]*$/.test(raw)) {
      setLeftFilter(raw)
    }
  }

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
        position: 'relative'
      }}
    >
      <Typography variant='h6' sx={{ mb: 1 }}>
        Все элементы, кроме выбранных
      </Typography>

      <Stack direction='row' spacing={1} sx={{ mb: 1.5 }}>
        <TextField
          size='small'
          fullWidth
          label='Фильтр по ID'
          placeholder='Формат: 1 3 43 100 ...'
          value={leftFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
      </Stack>

      <LeftList
        parentRef={list.parentRef}
        virtualizer={list.virtualizer}
        items={list.items}
        isFetchingNextPage={list.isFetchingNextPage}
        onDoubleClick={() => setAddModalOpen(true)}
        rowHeight={list.rowHeight}
      />

      <AddFab onClick={() => setAddModalOpen(true)} />
      <AddIdModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </Paper>
  )
}
