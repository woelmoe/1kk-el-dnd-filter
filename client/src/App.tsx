import { Container } from '@mui/material'
import { LeftContainer } from './components/LeftContainer/LeftContainer'
import { RightContainer } from './components/RightContainer/RightContainer'
import { OnBoarding } from './components/OnBoarding/OnBoarding'
import { useSelectedLive } from './composable/useSelectedLive'

export default function App() {
  useSelectedLive()

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
      <LeftContainer />
      <RightContainer />
      <OnBoarding />
    </Container>
  )
}
