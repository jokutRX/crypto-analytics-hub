import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCoinsMarket } from '../api/getCoins'
import type { Coin } from './types'

// Типы для ключей сортировки
export type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap'
export type SortOrder = 'asc' | 'desc'

export const useCoinStore = defineStore('coin', () => {
  const coins = ref<Coin[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<number | null>(null)
  
  // Поиск и сортировка
  const searchQuery = ref<string>('')
  const sortKey = ref<SortKey>('market_cap_rank')
  const sortOrder = ref<SortOrder>('asc')

  const CACHE_DURATION = 30 * 1000

  // 1. Сначала фильтруем монеты по поиску
  const filteredCoins = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    
    if (!query) return coins.value

    return coins.value.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    )
  })

  // 2. Затем сортируем уже отфильтрованный список
  const sortedCoins = computed(() => {
    return [...filteredCoins.value].sort((a, b) => {
      const aVal = a[sortKey.value] ?? 0
      const bVal = b[sortKey.value] ?? 0

      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  })

  // Функция переключения сортировки по клику на заголовок
  function toggleSort(key: SortKey) {
    if (sortKey.value === key) {
      // Если кликаем по той же колонке — меняем порядок asc <-> desc
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      // Если по новой — устанавливаем ключ и сбрасываем на asc (или desc для процентов/цены)
      sortKey.value = key
      sortOrder.value = key === 'market_cap_rank' ? 'asc' : 'desc'
    }
  }

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

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    coins,
    searchQuery,
    sortKey,
    sortOrder,
    sortedCoins, // Возвращаем отсортированный список в компонент
    isLoading,
    error,
    lastFetchTime,
    fetchCoins,
    setSearchQuery,
    toggleSort,
  }
})