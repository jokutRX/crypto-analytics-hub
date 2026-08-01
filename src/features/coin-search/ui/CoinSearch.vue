<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCoinStore } from '@/entities/coin'

const coinStore = useCoinStore()
const localSearch = ref(coinStore.searchQuery)

let timeoutId: ReturnType<typeof setTimeout> | null = null


watch(localSearch, (newValue) => {
  if (timeoutId) clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    coinStore.setSearchQuery(newValue)
  }, 300)
})
</script>

<template>
  <div class="relative w-full sm:w-72">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <input
      v-model="localSearch"
      type="text"
      placeholder="Поиск по названию или тикеру..."
      class="w-full pl-9 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
    />

    <!-- Кнопка очистки (крестик) -->
    <button
      v-if="localSearch"
      @click="localSearch = ''"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
    >
      ✕
    </button>
  </div>
</template>