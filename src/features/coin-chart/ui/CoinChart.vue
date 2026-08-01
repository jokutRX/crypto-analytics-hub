<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { getCoinChart } from '@/entities/coin'

// Регистрируем необходимые модули Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const props = defineProps<{
  coinId: string
}>()

const selectedDays = ref<number>(7)
const rawPrices = ref<[number, number][]>([])
const isLoading = ref<boolean>(true)

// Доступные таймфреймы
const timeframes = [
  { label: '24 ч', days: 1 },
  { label: '7 дн', days: 7 },
  { label: '30 дн', days: 30 },
]

// Загрузка данных графика
const fetchChart = async () => {
  try {
    isLoading.value = true
    const data = await getCoinChart(props.coinId, selectedDays.value)
    rawPrices.value = data.prices
  } catch (e) {
    console.error('Ошибка при загрузке графика:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchChart)

// Перезапрашиваем данные при смене интервала
watch(selectedDays, fetchChart)

// Вычисляем динамику цены (рост/падение)
const isPositive = computed(() => {
  if (rawPrices.value.length < 2) return true
  const first = rawPrices.value[0][1]
  const last = rawPrices.value[rawPrices.value.length - 1][1]
  return last >= first
})

// Подготовка данных для Chart.js
const chartData = computed<ChartData<'line'>>(() => {
  const labels = rawPrices.value.map(([timestamp]) => {
    const date = new Date(timestamp)
    return selectedDays.value === 1
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  })

  const prices = rawPrices.value.map(([, price]) => price)
  const lineColor = isPositive.value ? '#34d399' : '#f87171' // Зеленый или Красный

  return {
    labels,
    datasets: [
      {
        label: 'Цена (USD)',
        data: prices,
        borderColor: lineColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          if (isPositive.value) {
            gradient.addColorStop(0, 'rgba(52, 211, 153, 0.25)')
            gradient.addColorStop(1, 'rgba(52, 211, 153, 0.0)')
          } else {
            gradient.addColorStop(0, 'rgba(248, 113, 113, 0.25)')
            gradient.addColorStop(1, 'rgba(248, 113, 113, 0.0)')
          }
          return gradient
        },
        tension: 0.2,
      },
    ],
  }
})

// Настройки внешнего вида графика
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          const value = context.parsed.y ?? 0
          return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        },
      },
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: {
        color: '#9ca3af',
        font: { size: 10 },
        callback: (value) => `$${Number(value).toLocaleString()}`,
      },
    },
  },
}
</script>

<template>
  <div class="bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
    <!-- Шапка графика и переключатель дней -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-white">График цены</h3>
      
      <div class="flex gap-1 bg-gray-800/80 p-1 rounded-lg border border-gray-700">
        <button
          v-for="tf in timeframes"
          :key="tf.days"
          @click="selectedDays = tf.days"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-colors',
            selectedDays === tf.days
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          ]"
        >
          {{ tf.label }}
        </button>
      </div>
    </div>

    <!-- Область графика -->
    <div class="h-64 relative">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900/40 rounded-xl">
        <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
      <Line v-else-if="rawPrices.length" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full flex items-center justify-center text-gray-500">
        Нет данных для построения графика
      </div>
    </div>
  </div>
</template>