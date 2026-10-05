import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Button, Portal, Divider } from '@mui/material'

const STORAGE_KEY = 'onboarding-seen'

export function Onboarding() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== '1') {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Paper sx={{ p: 3, maxWidth: 500 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Как добавить элемент:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 1 }}>
            1. <b> Двойной клик</b> по элементу в левой панели — добавить его в
            правую.
          </Typography>
          <Typography sx={{ mb: 3 }}>
            2. Или нажмите <b>кнопку +</b> внизу справа — откроется окно ввода ID.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={dismiss}>
              Понятно
            </Button>
          </Box>
        </Paper>
      </Box>
    </Portal>
  )
}
