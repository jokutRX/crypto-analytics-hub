<script setup lang="ts">
import { CryptoTable } from '@/widgets/crypto-table'
</script>

<template>
  <main class="min-h-screen bg-gray-950 text-gray-100 py-10 px-4">
    <div class="max-w-6xl mx-auto mb-8 text-center">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
        Crypto Analytics Hub
      </h1>
      <p class="text-gray-400">Мониторинг цен криптовалют в реальном времени с поддержкой FSD</p>
    </div>

    <CryptoTable />
  </main>
</template>