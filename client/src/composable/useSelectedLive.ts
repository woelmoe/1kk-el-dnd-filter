import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../api/types'
import { lastLocalMutation } from './useDnd/useDnd'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const IGNORE_WINDOW_MS = 2_000

export function useSelectedLive() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/events`)

    eventSource.addEventListener('selected:changed', () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Left] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
    })

    eventSource.addEventListener('order:changed', () => {
      const now = Date.now()
      if (now - lastLocalMutation.current < IGNORE_WINDOW_MS) {
        return
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Right] })
    })

    return () => {
      eventSource.close()
    }
  }, [queryClient])
}
