import { Container } from '@mui/material'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { LeftContainer } from './components/LeftContainer/LeftContainer'
import { RightContainer } from './components/RightContainer/RightContainer'
import { OnBoarding } from './components/OnBoarding/OnBoarding'
import { useSelectedLive } from './composable/useSelectedLive'
import { useRightQuery } from './composable/useRightQuery'
import { useDndSetup } from './composable/useDnd/useDndSetup'

export default function App() {
  useSelectedLive()

  const { items: rightItems, queryKey: rightQueryKey } = useRightQuery()

  const { sensors, activeId, onDragStart, onDragEnd, onDragCancel } =
    useDndSetup({ rightItems, rightQueryKey })

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      autoScroll={false}
    >
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

      <DragOverlay>
        {activeId !== null ? (
          <div
            style={{
              padding: '8px 16px',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'grabbing'
            }}
          >
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
