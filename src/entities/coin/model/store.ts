import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCoinsMarket } from '../api/getCoins'
import type { Coin } from './types'

export type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap'
export type SortOrder = 'asc' | 'desc'

export const useCoinStore = defineStore('coin', () => {
  const coins = ref<Coin[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<number | null>(null)
  
  // Поиск, сортировка и фильтрация
  const searchQuery = ref<string>('')
  const sortKey = ref<SortKey>('market_cap_rank')
  const sortOrder = ref<SortOrder>('asc')
  const isFavoritesOnly = ref<boolean>(false) // Показать только избранные

  // Массив ID избранных монет (будет сохраняться в localStorage)
  const favoriteIds = ref<string[]>([])

  const CACHE_DURATION = 30 * 1000

  // 1. Добавление / Удаление из избранного
  function toggleFavorite(coinId: string) {
    const index = favoriteIds.value.indexOf(coinId)
    if (index === -1) {
      favoriteIds.value.push(coinId)
    } else {
      favoriteIds.value.splice(index, 1)
    }
  }

  // Проверка, находится ли монета в избранном
  function isFavorite(coinId: string): boolean {
    return favoriteIds.value.includes(coinId)
  }

  // 2. Фильтрация монет (Поиск + Избранное)
  const filteredCoins = computed(() => {
    let result = coins.value

    // Фильтр по Избранным
    if (isFavoritesOnly.value) {
      result = result.filter((coin) => favoriteIds.value.includes(coin.id))
    }

    // Фильтр по поиску
    const query = searchQuery.value.trim().toLowerCase()
    if (query) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      )
    }

    return result
  })

  // 3. Сортировка отфильтрованного списка
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

  function toggleSort(key: SortKey) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = key === 'market_cap_rank' ? 'asc' : 'desc'
    }
  }

  async function fetchCoins(force: boolean = false) {
    const now = Date.now()

    if (!force && lastFetchTime.value && now - lastFetchTime.value < CACHE_DURATION) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await getCoinsMarket()
      coins.value = data
      lastFetchTime.value = Date.now()
    } catch (err: any) {
      error.value = 'Не удалось загрузить данные.'
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
    isFavoritesOnly,
    favoriteIds,
    sortedCoins,
    isLoading,
    error,
    lastFetchTime,
    fetchCoins,
    setSearchQuery,
    toggleSort,
    toggleFavorite,
    isFavorite,
  }
}, {
  persist: {
    pick: ['favoriteIds'],
  },
})