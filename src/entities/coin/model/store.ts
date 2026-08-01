import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCoinsMarket } from '../api/getCoins'
import type { Coin } from './types'

export const useCoinStore = defineStore('coin', () => {
  const coins = ref<Coin[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  const lastFetchTime = ref<number | null>(null)
  const CACHE_DURATION = 30 * 1000 // 30 секунд

  async function fetchCoins(force: boolean = false) {
    const now = Date.now()

    if (!force && lastFetchTime.value && now - lastFetchTime.value < CACHE_DURATION) {
      return
    }

    if (force && lastFetchTime.value && now - lastFetchTime.value < 5000) {
      console.warn('Слишком частый клик! Подождите 5 секунд.')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await getCoinsMarket()
      coins.value = data
      lastFetchTime.value = Date.now()
    } catch (err: any) {
      error.value = err?.response?.status === 429
        ? 'Превышен лимит запросов API. Данные временно не обновляются.'
        : 'Не удалось загрузить новые данные.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    coins,
    isLoading,
    error,
    lastFetchTime,
    fetchCoins,
  }
})