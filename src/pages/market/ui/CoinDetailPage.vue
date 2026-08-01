<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCoinDetails, type CoinDetail } from '@/entities/coin'
import { CoinChart } from '@/features'
import { formatCurrency, formatPercent } from '@/shared/lib/formatters'

const route = useRoute()
const router = useRouter()

const coin = ref<CoinDetail | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const coinId = route.params.id as string
  try {
    isLoading.value = true
    coin.value = await getCoinDetails(coinId)
  } catch (e) {
    error.value = 'Не удалось загрузить детальную информацию о монете.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <!-- Кнопка Назад -->
    <button 
      @click="router.back()" 
      class="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition text-sm font-medium flex items-center gap-2 cursor-pointer"
    >
      ← Назад к списку
    </button>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="text-center py-20 text-gray-400">
      <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
      <p>Загрузка данных монеты...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-center">
      {{ error }}
    </div>

    <!-- Основной контент -->
    <div v-else-if="coin" class="space-y-6">
      <!-- Шапка монеты -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
        <div class="flex items-center gap-4">
          <img :src="coin.image.large" :alt="coin.name" class="w-14 h-14 sm:w-16 sm:h-16" />
          <div>
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ coin.name }}</h1>
              <span class="text-gray-400 uppercase font-mono text-base sm:text-lg">{{ coin.symbol }}</span>
              <span class="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                Rank #{{ coin.market_cap_rank }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-1">Официальные данные CoinGecko</p>
          </div>
        </div>

        <div class="text-left sm:text-right">
          <div class="text-2xl sm:text-3xl font-bold font-mono text-white">
            {{ formatCurrency(coin.market_data.current_price.usd) }}
          </div>
          <div 
            class="font-mono font-medium text-sm mt-0.5"
            :class="coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'"
          >
            {{ formatPercent(coin.market_data.price_change_percentage_24h) }} (24ч)
          </div>
        </div>
      </div>

      <!-- График цены -->
      <CoinChart :coin-id="coin.id" />

      <!-- Сетка ключевых метрик -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Капитализация -->
        <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-between overflow-hidden">
          <span class="text-[11px] text-gray-400 uppercase font-medium whitespace-nowrap truncate">
            Рыночная капитализация
          </span>
          <p class="text-sm sm:text-base font-mono font-semibold text-white mt-1 truncate" :title="formatCurrency(coin.market_data.market_cap.usd)">
            {{ formatCurrency(coin.market_data.market_cap.usd) }}
          </p>
        </div>

        <!-- 2. Объем 24ч -->
        <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-between overflow-hidden">
          <span class="text-[11px] text-gray-400 uppercase font-medium whitespace-nowrap truncate">
            Объем торгов (24ч)
          </span>
          <p class="text-sm sm:text-base font-mono font-semibold text-white mt-1 truncate" :title="formatCurrency(coin.market_data.total_volume.usd)">
            {{ formatCurrency(coin.market_data.total_volume.usd) }}
          </p>
        </div>

        <!-- 3. ATH -->
        <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-between overflow-hidden">
          <span class="text-[11px] text-gray-400 uppercase font-medium whitespace-nowrap truncate">
            Исторический максимум (ATH)
          </span>
          <p class="text-sm sm:text-base font-mono font-semibold text-white mt-1 truncate" :title="formatCurrency(coin.market_data.ath.usd)">
            {{ formatCurrency(coin.market_data.ath.usd) }}
          </p>
        </div>

        <!-- 4. В обращении -->
        <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-between overflow-hidden">
          <span class="text-[11px] text-gray-400 uppercase font-medium whitespace-nowrap truncate">
            В обращении
          </span>
          <p class="text-sm sm:text-base font-mono font-semibold text-white mt-1 truncate">
            {{ coin.market_data.circulating_supply.toLocaleString() }} {{ coin.symbol.toUpperCase() }}
          </p>
        </div>
      </div>

      <!-- Описание монеты (если доступно) -->
      <div v-if="coin.description.en" class="bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
        <h3 class="text-lg font-bold text-white mb-3">О монете</h3>
        <p class="text-gray-300 text-sm leading-relaxed line-clamp-6" v-html="coin.description.en"></p>
      </div>
    </div>
  </div>
</template>