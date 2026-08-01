import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'market',
      component: () => import('@/pages/market/ui/MarketPage.vue'),
    },
    {
      path: '/coin/:id',
      name: 'coin-details',
      component: () => import('@/pages/market/ui/CoinDetailPage.vue'),
    },
  ],
})