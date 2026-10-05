import { useState } from 'react'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMutation } from '@tanstack/react-query'
import { addToLeft } from '../api'

export function AddFab() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState('')

  const mutation = useMutation({
    mutationFn: (id: number) => addToLeft(id),
    onSuccess: (_, id) => {
      setOpen(false)
      setValue('')
      setError('')
      setSnackbar(`ID ${id} принят. Применится в течение 10 секунд.`)
    },
    onError: (err: any) => {
      const status = err?.response?.status
      if (status === 409) {
        setError('Этот ID уже есть в системе')
      } else if (status === 400) {
        setError('Некорректный ID')
      } else {
        setError('Ошибка. Попробуйте позже')
      }
    }
  })

  const handleChange = (raw: string) => {
    if (/^\d*$/.test(raw)) {
      setValue(raw)
      setError('')
    }
  }

  const handleSubmit = () => {
    const id = Number(value)
    if (!Number.isInteger(id) || id < 1) {
      setError('ID должен быть целым числом больше 0')
      return
    }
    setError('')
    mutation.mutate(id)
  }

  const handleClose = () => {
    if (mutation.isPending) return
    setOpen(false)
    setValue('')
    setError('')
  }

  return (
    <>
      <Fab
        color='primary'
        sx={{ position: 'absolute', bottom: 38, right: 48 }}
        onClick={() => setOpen(true)}
        aria-label='добавить элемент'
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>Добавить ID</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Введите ID для добавления в систему. Если ID уже есть — ничего не
            произойдёт.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label='ID'
            placeholder='Например: 2000000'
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            error={!!error}
            helperText={error || 'Только цифры'}
            disabled={mutation.isPending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={mutation.isPending}>
            Отмена
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!value || mutation.isPending}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={5000}
        onClose={() => setSnackbar('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity='success' onClose={() => setSnackbar('')}>
          {snackbar}
        </Alert>
      </Snackbar>
    </>
  )
}
