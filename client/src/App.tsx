import { Container } from '@mui/material'
import { LeftPanel } from './components/LeftPanel'
import { Onboarding } from './components/OnBoardings'

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
      <Onboarding />
    </Container>
  )
}
