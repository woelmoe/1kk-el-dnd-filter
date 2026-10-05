import { Container } from '@mui/material'
import { LeftPanel } from './components/LeftPanel'
import { OnBoarding } from './components/OnBoarding/OnBoarding'

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
      <LeftPanel />
      <div style={{ border: '1px dashed gray', padding: 16 }}>
        Правая панель (заглушка)
      </div>
      <OnBoarding />
    </Container>
  )
}
