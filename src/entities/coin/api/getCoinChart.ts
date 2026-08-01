import { apiClient } from '@/shared/api'

export interface CoinChartResponse {
  prices: [number, number][]
}

export const getCoinChart = async (id: string, days: number = 7): Promise<CoinChartResponse> => {
  const response = await apiClient.get<CoinChartResponse>(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: days,
    },
  })
  return response.data
}