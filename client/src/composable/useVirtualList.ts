import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { IPage } from '../api'

interface IOptions {
  queryKey: QueryKey
  getPage: (cursor: number) => Promise<IPage>
  rowHeight?: number
  overscan?: number
}

export function useVirtualList({
  queryKey,
  getPage,
  rowHeight = 44,
  overscan = 20
}: IOptions) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined)
  })

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data]
  )

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan
  })

  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const onScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - rowHeight * 20

      if (nearBottom && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage()
      }
    }

    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [query, rowHeight])

  return {
    parentRef,
    virtualizer,
    items,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false
  }
}
