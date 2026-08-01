<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCoinDetails, type CoinDetail } from '@/entities/coin'
import { formatCurrency, formatPercent } from '@/shared/lib/formatters'

const route = useRoute()
const router = useRouter()

const coin = ref<CoinDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const coinId = route.params.id as string
  try {
    isLoading.value = true
    coin.value = await getCoinDetails(coinId)
  } catch (e) {
    error.value = 'Не удалось загрузить информацию о монете.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Кнопка Назад -->
    <button 
      @click="router.back()" 
      class="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition text-sm flex items-center gap-2"
    >
      ← Назад к списку
    </button>

    <!-- Загрузка -->
    <div v-if="isLoading" class="text-center py-20 text-gray-400">
      <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
      <p>Загрузка деталей монеты...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-center">
      {{ error }}
    </div>

    <!-- Контент -->
    <div v-else-if="coin" class="space-y-6">
      <!-- Шапка -->
      <div class="flex items-center gap-4 bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
        <img :src="coin.image.large" :alt="coin.name" class="w-16 h-16" />
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-white">{{ coin.name }}</h1>
            <span class="text-gray-400 uppercase font-mono text-lg">{{ coin.symbol }}</span>
            <span class="px-2.5 py-1 bg-gray-800 text-xs font-semibold text-blue-400 rounded-full border border-blue-500/20">
              Rank #{{ coin.market_cap_rank }}
            </span>
          </div>
          <div class="flex items-center gap-4 mt-2">
            <span class="text-2xl font-bold font-mono text-white">
              {{ formatCurrency(coin.market_data.current_price.usd) }}
            </span>
            <span 
              class="font-mono font-medium text-sm"
              :class="coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ formatPercent(coin.market_data.price_change_percentage_24h) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Сетка метрик -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <span class="text-xs text-gray-400 uppercase font-medium">Рыночная капитализация</span>
          <p class="text-lg font-mono font-semibold text-white mt-1">
            {{ formatCurrency(coin.market_data.market_cap.usd) }}
          </p>
        </div>

        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <span class="text-xs text-gray-400 uppercase font-medium">Объем торгов (24ч)</span>
          <p class="text-lg font-mono font-semibold text-white mt-1">
            {{ formatCurrency(coin.market_data.total_volume.usd) }}
          </p>
        </div>

        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <span class="text-xs text-gray-400 uppercase font-medium">Исторический максимум (ATH)</span>
          <p class="text-lg font-mono font-semibold text-white mt-1">
            {{ formatCurrency(coin.market_data.ath.usd) }}
          </p>
        </div>

        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <span class="text-xs text-gray-400 uppercase font-medium">В обращении</span>
          <p class="text-lg font-mono font-semibold text-white mt-1">
            {{ coin.market_data.circulating_supply.toLocaleString() }} {{ coin.symbol.toUpperCase() }}
          </p>
        </div>
      </div>

      <!-- Описание (если есть) -->
      <div v-if="coin.description.en" class="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
        <h3 class="text-lg font-bold text-white mb-3">О монете</h3>
        <p class="text-gray-300 text-sm leading-relaxed line-clamp-6" v-html="coin.description.en"></p>
      </div>
    </div>
  </div>
</template>