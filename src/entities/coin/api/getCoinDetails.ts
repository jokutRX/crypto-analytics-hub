import { apiClient } from '@/shared/api'

export interface CoinDetail {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  image: { large: string; small: string }
  description: { en: string }
  market_data: {
    current_price: { usd: number }
    price_change_percentage_24h: number
    market_cap: { usd: number }
    total_volume: { usd: number }
    ath: { usd: number }
    ath_change_percentage: { usd: number }
    circulating_supply: number
  }
}

export const getCoinDetails = async (id: string): Promise<CoinDetail> => {
  const response = await apiClient.get<CoinDetail>(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
    },
  })
  return response.data
}