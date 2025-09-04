import { useMutation } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

export type SubmitContributionData = {
  name: string
  email: string
  message: string
  category: number
}

interface SubmitContributionResponse {
  success: boolean
  data?: any
  error?: string
}

const submitContribution = async (
  data: SubmitContributionData
): Promise<SubmitContributionResponse> => {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/contribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const response = (await res.json()) as SubmitContributionResponse

  if (!res.ok) {
    throw new Error(response.error || `Failed to submit: ${res.status}`)
  }

  return response
}

export const useSubmitContribution = () => {
  return useMutation({
    mutationFn: submitContribution,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  })
}
