import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

export type Category = {
  id: number
  display_name: string
  created_at: string
}

interface CategoriesApiResponse {
  success: boolean
  data: Category[]
}

const fetchCategories = async (): Promise<Category[]> => {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/contribute/categories`)

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`)
  }

  const response = (await res.json()) as CategoriesApiResponse

  if (!response.success || !response.data) {
    throw new Error('Invalid categories response')
  }

  return response.data
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
