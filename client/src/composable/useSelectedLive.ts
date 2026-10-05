import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../api/types'

export function useSelectedLive() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource('/api/events')

    eventSource.addEventListener('selected:changed', () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Left] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
    })

    eventSource.addEventListener('order:changed', () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
    })

    return () => {
      eventSource.close()
    }
  }, [queryClient])
}
