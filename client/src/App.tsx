import { Box, Container } from '@mui/material'

export default function App() {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        p: 2,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 2,
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ border: '1px dashed gray', p: 2 }}>
        Левая панель (заглушка)
      </Box>
      <Box sx={{ border: '1px dashed gray', p: 2 }}>
        Правая панель (заглушка)
      </Box>
    </Container>
  )
}
