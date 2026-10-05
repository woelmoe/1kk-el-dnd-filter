import { useState } from 'react'
import { Container } from '@mui/material'
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent
} from '@dnd-kit/core'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LeftContainer } from './components/LeftContainer/LeftContainer'
import { RightContainer } from './components/RightContainer/RightContainer'
import { OnBoarding } from './components/OnBoarding/OnBoarding'
import { useSelectedLive } from './composable/useSelectedLive'
import { useCrossContainerDnd } from './composable/useDnd'
import { useFilters } from './store/filter'
import { useDebouncedValue } from './composable/useDebouncedValue'
import { getRight } from './api/api'
import { QueryKeys } from './api/types'

export default function App() {
  useSelectedLive()

  const { rightFilter } = useFilters()
  const debouncedRightFilter = useDebouncedValue(rightFilter, 300)
  const rightQueryKey: [string, string] = [
    QueryKeys.Right,
    debouncedRightFilter
  ]

  const rightQuery = useInfiniteQuery({
    queryKey: rightQueryKey,
    queryFn: ({ pageParam }) => getRight(debouncedRightFilter, pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined)
  })

  const rightItems = rightQuery.data?.pages.flatMap((page) => page.items) ?? []

  const { sensors, handleDragEnd } = useCrossContainerDnd({
    rightItems,
    rightQueryKey
  })

  const [activeId, setActiveId] = useState<number | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id))
  }

  const handleDragEndInternal = (event: DragEndEvent) => {
    handleDragEnd(event)
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndInternal}
      onDragCancel={handleDragCancel}
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
