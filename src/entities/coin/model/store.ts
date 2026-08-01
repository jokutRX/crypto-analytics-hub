import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCoinsMarket } from '../api/getCoins'
import type { Coin } from './types'

export const useCoinStore = defineStore('coin', () => {
  const coins = ref<Coin[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<number | null>(null)
  
  // 1. Состояние поискового запроса
  const searchQuery = ref<string>('')

  const CACHE_DURATION = 30 * 1000

  // 2. Вычисляемый список отфильтрованных монет (по имени или символу)
  const filteredCoins = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    
    if (!query) return coins.value

    return coins.value.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    )
  })

  async function fetchCoins(force: boolean = false) {
    const now = Date.now()

    if (!force && lastFetchTime.value && now - lastFetchTime.value < CACHE_DURATION) {
      return
    }

    if (force && lastFetchTime.value && now - lastFetchTime.value < 5000) {
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

  // 3. Функция для обновления поискового запроса
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    coins,
    searchQuery,
    filteredCoins, // Возвращаем отфильтрованный список
    isLoading,
    error,
    lastFetchTime,
    fetchCoins,
    setSearchQuery,
  }
})