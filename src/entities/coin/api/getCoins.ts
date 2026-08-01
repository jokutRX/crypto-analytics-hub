import { apiClient } from '@/shared/api'
import type { Coin } from '../model/types'

export const getCoinsMarket = async (currency = 'usd', limit = 25): Promise<Coin[]> => {
  const { data } = await apiClient.get<Coin[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: limit,
      page: 1,
      sparkline: false,
    },
  })
  return data
}