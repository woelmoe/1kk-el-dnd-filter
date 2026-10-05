import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
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
import { useMutation } from '@tanstack/react-query'
import { addToLeft } from '../api'

interface IProps {
  open: boolean
  onClose: () => void
}

export function AddIdModal({ open, onClose }: IProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (id: number) => addToLeft(id),
    onSuccess: (_, id) => {
      setValue('')
      setError('')
      setSnackbar(`ID ${id} принят. Применится в течение 10 секунд.`)
      onClose()
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

  useEffect(() => {
    if (open) {
      setValue('')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

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
    onClose()
    setError('')
  }

  const modalsRoot = document.getElementById('modals')
  if (!modalsRoot) return null

  return createPortal(
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>Добавить ID</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Введите ID для добавления в систему.
          </DialogContentText>
          <TextField
            inputRef={inputRef}
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
    </>,
    modalsRoot
  )
}
