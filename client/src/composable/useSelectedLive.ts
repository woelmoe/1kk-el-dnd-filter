import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useSelectedLive() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource('/api/events')

    eventSource.addEventListener('selected:changed', () => {
      queryClient.invalidateQueries({ queryKey: ['left'] })
      queryClient.invalidateQueries({ queryKey: ['right'] })
    })

    eventSource.addEventListener('order:changed', () => {
      queryClient.invalidateQueries({ queryKey: ['right'] })
    })

    return () => {
      eventSource.close()
    }
  }, [queryClient])
}
