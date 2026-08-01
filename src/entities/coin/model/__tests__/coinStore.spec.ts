import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCoinStore } from '../store'
import * as api from '../../api/getCoins'

// Мокаем API-модуль
vi.mock('../../api/getCoins', () => ({
  getCoinsMarket: vi.fn(),
}))

describe('Coin Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('успешно загружает монеты и учитывает кэш', async () => {
    const mockCoins = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000, market_cap: 1000000, market_cap_rank: 1, price_change_percentage_24h: 2.5, total_volume: 5000 },
    ]
    
    vi.mocked(api.getCoinsMarket).mockResolvedValueOnce(mockCoins as any)

    const store = useCoinStore()
    
    // Первый вызов — идет реальный запрос
    await store.fetchCoins()
    expect(store.coins.length).toBe(1)
    expect(api.getCoinsMarket).toHaveBeenCalledTimes(1)

    // Второй вызов сразу после — должен отработать кэш (API не вызывается повторно)
    await store.fetchCoins()
    expect(api.getCoinsMarket).toHaveBeenCalledTimes(1)
  })

  it('корректно обрабатывает ошибку 429 (Too Many Requests)', async () => {
    vi.mocked(api.getCoinsMarket).mockRejectedValueOnce({
      response: { status: 429 },
      message: 'Rate limit exceeded',
    })

    const store = useCoinStore()
    await store.fetchCoins()

    expect(store.error).toBeTruthy()
    expect(store.coins.length).toBe(0)
    expect(store.isLoading).toBe(false)
  })
})