import { useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { IPage } from '../api/api'

interface IOptions {
  queryKey: QueryKey
  getPage: (cursor: number) => Promise<IPage>
  visibleRows?: number
  overscan?: number
}

export function useVirtualList({
  queryKey,
  getPage,
  visibleRows = 20,
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
  const [rowHeight, setRowHeight] = useState(50)

  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const updateRowHeight = () => {
      const h = el.clientHeight
      if (h > 0) {
        setRowHeight(h / visibleRows)
      }
    }

    updateRowHeight()

    const observer = new ResizeObserver(updateRowHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [visibleRows])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan
  })

  useEffect(() => {
    virtualizer.measure()
  }, [rowHeight, virtualizer])

  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const onScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - rowHeight * 5

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
    rowHeight,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false
  }
}
