import { create } from 'zustand'

interface IFiltersState {
  leftFilter: string
  rightFilter: string
  setLeftFilter: (value: string) => void
  setRightFilter: (value: string) => void
}

export const useFilters = create<IFiltersState>((set) => ({
  leftFilter: '',
  rightFilter: '',

  setLeftFilter: (value) => set({ leftFilter: value }),
  setRightFilter: (value) => set({ rightFilter: value })
}))
