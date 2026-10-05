import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL: `${API_URL}/api`
})

export interface IPage {
  items: number[]
  nextCursor: number
  hasMore: boolean
}

export async function getLeft(filter: string, cursor: number): Promise<IPage> {
  const { data } = await api.get<IPage>('/left', {
    params: { filter, cursor, limit: 20 }
  })
  return data
}

export async function getRight(filter: string, cursor: number): Promise<IPage> {
  const { data } = await api.get<IPage>('/right', {
    params: { filter, cursor, limit: 20 }
  })
  return data
}

export async function addToLeft(id: number) {
  await api.post('/left', { id })
}

export async function addToRight(id: number) {
  await api.post('/right', { id })
}

export async function removeFromRight(id: number) {
  await api.delete(`/right/${id}`)
}

export async function updateRightOrder(order: number[]) {
  await api.patch('/right', { order })
}
