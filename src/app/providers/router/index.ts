import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'market',
      component: () => import('@/pages/market/ui/MarketPage.vue'), // Указываем правильный путь к MarketPage
    },
    {
      path: '/coin/:id',
      name: 'coin-details',
      component: () => import('@/pages/market/ui/CoinDetailPage.vue'), // Указываем путь к CoinDetailPage
    },
  ],
})