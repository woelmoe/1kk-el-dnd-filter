import { useInfiniteQuery } from '@tanstack/react-query'
import { getRight } from '../api/api'
import { useFilters } from '../store/filter'
import { useDebouncedValue } from './useDebouncedValue'
import { QueryKeys } from '../api/types'

export function useRightQuery() {
  const { rightFilter } = useFilters()
  const debouncedFilter = useDebouncedValue(rightFilter, 300)

  const queryKey: [string, string] = [QueryKeys.Right, debouncedFilter]

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getRight(debouncedFilter, pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined)
  })

  const items = query.data?.pages.flatMap((page) => page.items) ?? []

  return {
    queryKey,
    items,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}
