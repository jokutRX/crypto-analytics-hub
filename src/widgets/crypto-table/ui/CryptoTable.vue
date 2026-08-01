<script setup lang="ts">
import { onMounted } from 'vue'
import { useCoinStore } from '@/entities/coin' 
import { formatCurrency, formatPercent } from '@/shared/lib/formatters'

const coinStore = useCoinStore()

onMounted(() => {
  coinStore.fetchCoins(false)
})

const handleRefresh = () => {
  coinStore.fetchCoins(true)
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">🔥 Рынок криптовалют</h2>
      
      <button 
        @click="handleRefresh" 
        :disabled="coinStore.isLoading"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium flex items-center gap-2"
      >
        <div 
          v-if="coinStore.isLoading" 
          class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        ></div>
        {{ coinStore.isLoading ? 'Загрузка...' : 'Обновить' }}
      </button>
    </div>

    <div v-if="coinStore.isLoading && !coinStore.coins.length" class="text-center py-12 text-gray-400">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
      <p>Загрузка данных с CoinGecko...</p>
    </div>

    <div v-else-if="coinStore.error && !coinStore.coins.length" class="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-center">
      {{ coinStore.error }}
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 shadow-xl">
      
      <div 
        v-if="coinStore.error" 
        class="p-2.5 bg-amber-900/40 border-b border-amber-700/50 text-amber-200 text-xs text-center flex items-center justify-center gap-2"
      >
        <span>⚠️ {{ coinStore.error }}</span>
        <span class="text-amber-400/70">(отображаются сохраненные данные)</span>
      </div>

      <table class="w-full text-left text-sm text-gray-300">
        <thead class="bg-gray-800/80 text-xs uppercase text-gray-400 border-b border-gray-700">
          <tr>
            <th class="py-3 px-4">#</th>
            <th class="py-3 px-4">Монета</th>
            <th class="py-3 px-4 text-right">Цена</th>
            <th class="py-3 px-4 text-right">24ч %</th>
            <th class="py-3 px-4 text-right">Капитализация</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr 
            v-for="coin in coinStore.coins" 
            :key="coin.id"
            class="hover:bg-gray-800/50 transition-colors"
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
        </tbody>
      </table>
    </div>
  </div>
</template>