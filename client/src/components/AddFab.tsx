import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface IProps {
  onClick: () => void
}

export function AddFab({ onClick }: IProps) {
  return (
    <Fab
      color='primary'
      sx={{ position: 'absolute', bottom: 40, right: 48 }}
      onClick={onClick}
      aria-label='добавить элемент'
    >
      <AddIcon />
    </Fab>
  )
}
