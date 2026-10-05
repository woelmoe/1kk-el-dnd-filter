import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../api/types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export function useSelectedLive() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/events`)

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
