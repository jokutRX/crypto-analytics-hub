import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './app/providers/router'
import App from './App.vue'
import '@/app/styles/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')