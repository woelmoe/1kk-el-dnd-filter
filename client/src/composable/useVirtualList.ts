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
  const sensorRef = useRef<HTMLDivElement>(null)
  const [rowHeight, setRowHeight] = useState(50)

  // вычисляем высоту элемента в списке, чтобы подогнать под visibleRows элементов
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
    const sensor = sensorRef.current
    const root = parentRef.current
    if (!sensor || !root) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        if (query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage()
        }
      },
      {
        root,
        rootMargin: `${rowHeight * 5}px 0px`,
        threshold: 0
      }
    )

    observer.observe(sensor)
    return () => observer.disconnect()
  }, [query.hasNextPage, query.isFetchingNextPage, rowHeight, query])

  // автоподгрузка, если скролл не появился
  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const check = () => {
      const noScroll = el.scrollHeight <= el.clientHeight
      if (noScroll && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage()
      }
    }

    check()
    const raf = requestAnimationFrame(check)
    const timer = setTimeout(check, 200)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [items.length, query.hasNextPage, query.isFetchingNextPage, rowHeight])

  return {
    parentRef,
    sensorRef,
    virtualizer,
    items,
    rowHeight,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false
  }
}
