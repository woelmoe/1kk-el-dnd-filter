import { Container } from '@mui/material'
import { RightContainer } from './components/RightContainer/RightContainer'
import { OnBoarding } from './components/OnBoarding/OnBoarding'
import { LeftContainer } from './components/LeftContainer/LeftContainer'

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
      <LeftContainer />
      <RightContainer />
      <OnBoarding />
    </Container>
  )
}
