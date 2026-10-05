import { Paper, Stack, TextField, Typography } from '@mui/material'
import { useFilters } from '../../store/filter'
import { useDebouncedValue } from '../../composable/useDebouncedValue'
import { useVirtualList } from '../../composable/useVirtualList'
import { getRight } from '../../api/api'
import { RightList } from './RightList'
import { QueryKeys } from '../../api/types'

export function RightContainer() {
  const { rightFilter, setRightFilter } = useFilters()
  const debouncedFilter = useDebouncedValue(rightFilter, 300)

  const list = useVirtualList({
    queryKey: [QueryKeys.Right, debouncedFilter],
    getPage: (cursor) => getRight(debouncedFilter, cursor)
  })

  const handleFilterChange = (raw: string) => {
    if (/^[0-9\s]*$/.test(raw)) {
      setRightFilter(raw)
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
        borderColor: 'divider'
      }}
    >
      <Typography variant='h6' sx={{ mb: 1 }}>
        Выбранные элементы
      </Typography>

      <Stack direction='row' spacing={1} sx={{ mb: 1.5 }}>
        <TextField
          size='small'
          fullWidth
          label='Фильтр по ID'
          placeholder='Формат: 1 3 43 100 ...'
          value={rightFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
      </Stack>

      <RightList
        parentRef={list.parentRef}
        sensorRef={list.sensorRef}
        virtualizer={list.virtualizer}
        items={list.items}
        isFetchingNextPage={list.isFetchingNextPage}
        rowHeight={list.rowHeight}
      />
    </Paper>
  )
}
