import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { router } from './app/providers/router'
import App from './App.vue'
import '@/app/styles/index.css'

const app = createApp(App)
const pinia = createPinia()


pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')