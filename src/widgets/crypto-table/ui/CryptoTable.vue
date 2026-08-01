<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoinStore, type SortKey } from '@/entities/coin' 
import { CoinSearch } from '@/features/coin-search'
import { formatCurrency, formatPercent } from '@/shared/lib/formatters'

const coinStore = useCoinStore()
const router = useRouter()

onMounted(() => {
  coinStore.fetchCoins(false)
})

const handleRefresh = () => {
  coinStore.fetchCoins(true)
}

// Переход на детальную страницу монеты
const goToCoinDetails = (coinId: string) => {
  router.push(`/coin/${coinId}`)
}

// Хелпер для отображения стрелочки сортировки
const getSortIcon = (key: SortKey) => {
  if (coinStore.sortKey !== key) return '↕'
  return coinStore.sortOrder === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <!-- Шапка страницы -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold text-white">🔥 Рынок криптовалют</h2>
      
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <CoinSearch />

        <button 
          @click="handleRefresh" 
          :disabled="coinStore.isLoading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium flex items-center gap-2 shrink-0"
        >
          <div 
            v-if="coinStore.isLoading" 
            class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          ></div>
          {{ coinStore.isLoading ? 'Загрузка...' : 'Обновить' }}
        </button>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="coinStore.isLoading && !coinStore.coins.length" class="text-center py-12 text-gray-400">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
      <p>Загрузка данных с CoinGecko...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="coinStore.error && !coinStore.coins.length" class="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-center">
      {{ coinStore.error }}
    </div>

    <!-- Таблица -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 shadow-xl">
      <table class="w-full text-left text-sm text-gray-300">
        <thead class="bg-gray-800/80 text-xs uppercase text-gray-400 border-b border-gray-700 select-none">
          <tr>
            <!-- Кликабельные колонки со стрелочками -->
            <th 
              @click="coinStore.toggleSort('market_cap_rank')" 
              class="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              # <span class="text-xs ml-1">{{ getSortIcon('market_cap_rank') }}</span>
            </th>
            
            <th class="py-3 px-4">Монета</th>
            
            <th 
              @click="coinStore.toggleSort('current_price')" 
              class="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
            >
              Цена <span class="text-xs ml-1">{{ getSortIcon('current_price') }}</span>
            </th>
            
            <th 
              @click="coinStore.toggleSort('price_change_percentage_24h')" 
              class="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
            >
              24ч % <span class="text-xs ml-1">{{ getSortIcon('price_change_percentage_24h') }}</span>
            </th>
            
            <th 
              @click="coinStore.toggleSort('market_cap')" 
              class="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
            >
              Капитализация <span class="text-xs ml-1">{{ getSortIcon('market_cap') }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <!-- Добавлены @click и cursor-pointer для строки -->
          <tr 
            v-for="coin in coinStore.sortedCoins" 
            :key="coin.id"
            @click="goToCoinDetails(coin.id)"
            class="hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <td class="py-4 px-4 font-mono text-gray-500">{{ coin.market_cap_rank }}</td>
            <td class="py-4 px-4 flex items-center gap-3">
              <img :src="coin.image" :alt="coin.name" class="w-7 h-7 rounded-full" />
              <div>
                <span class="font-semibold text-white block">{{ coin.name }}</span>
                <span class="text-xs text-gray-400 uppercase font-mono">{{ coin.symbol }}</span>
              </div>
            </td>
            <td class="py-4 px-4 text-right font-mono font-medium text-white">
              {{ formatCurrency(coin.current_price) }}
            </td>
            <td 
              class="py-4 px-4 text-right font-mono font-medium"
              :class="coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ formatPercent(coin.price_change_percentage_24h) }}
            </td>
            <td class="py-4 px-4 text-right font-mono text-gray-400">
              {{ formatCurrency(coin.market_cap) }}
            </td>
          </tr>

          <!-- Заглушка при пустом поиске -->
          <tr v-if="!coinStore.sortedCoins.length">
            <td colspan="5" class="py-8 text-center text-gray-500">
              Монеты по запросу «{{ coinStore.searchQuery }}» не найдены
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>