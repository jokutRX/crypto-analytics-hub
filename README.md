<div align="center">

# ⚡ Crypto Analytics Hub

  <p align="center">
    Современная аналитическая платформа для отслеживания рыночных показателей криптовалют в реальном времени.
  </p>

  <!-- Live Demo Button -->
  <p align="center">
    <a href="https://jokutrx.github.io/crypto-analytics-hub/" target="_blank">
      <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Смотреть_проект-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue 3" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Pinia-2.3-yellow?style=for-the-badge&logo=vue.js&logoColor=white" alt="Pinia" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vitest-2.1-7852EE?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>

</div>

---

## 🌐 Live Demo

Приложение развёрнуто и доступно в режиме онлайн:  
👉 **[https://jokutrx.github.io/crypto-analytics-hub/](https://jokutrx.github.io/crypto-analytics-hub/)**

---

## 🚀 Возможности

* 📊 **Котировки в реальном времени**: Данные о ценах, суточном объёме, капитализации и изменении за 24 часа.
* 📈 **Интерактивные графики цен**: Визуализация динамики монет с помощью `Chart.js` и `vue-chartjs`.
* ⭐️ **Избранное (Favorites)**: Быстрое добавление монет в закладки с автоматическим сохранением состояния в `localStorage` через `pinia-plugin-persistedstate`.
* 🔍 **Поиск и сортировка**: Поиск по названию/тикеру, а также гибкая сортировка по цене, рангу, капитализации и суточным изменениям.
* ⚡️ **Умное кэширование**: Защита от перегрузки API (`429 Too Many Requests`) благодаря встроенному кэшированию запросов на уровне стора.
* 🛡 **Строгая типизация**: Полная поддержка TypeScript без необработанных типов.
* 🧪 **Покрытие юнит-тестами**: Проверено с помощью `Vitest` (бизнес-логика Pinia-стора и хелперы форматирования).

---

## 🛠 Стек технологий

* **Core**: Vue 3 (`<script setup>`, Composition API), TypeScript, Vite
* **State Management**: Pinia, `pinia-plugin-persistedstate`
* **Routing**: Vue Router 4
* **UI & Styling**: Tailwind CSS, PostCSS, Autoprefixer
* **Charts**: Chart.js, `vue-chartjs`
* **HTTP Client**: Axios
* **Testing**: Vitest, `@pinia/testing`
* **Deployment**: GitHub Pages (`gh-pages`)

---

## 🏗 FSD-Архитектура (Feature-Sliced Design)

Проект структурирован по методологии **Feature-Sliced Design**, что обеспечивает понятное разделение ответственности и лёгкую масштабируемость:

```text
src/
├── app/                  # Инициализация приложения, глобальные стили, провайдеры
├── pages/                # Компоненты страниц (Главный рынок, Детализация монеты)
├── widgets/              # Составные блоки интерфейса (Таблица криптовалют)
├── features/             # Пользовательские фичи (Поиск, График монеты, Избранное)
├── entities/             # Бизнес-сущности (Монеты: типы, API, Pinia-стор)
└── shared/               # Переиспользуемые утилиты, UI-кит, хелперы (formatters)
```

⚡️ Быстрый старт
Требования
Node.js >= 18.0.0

pnpm (рекомендуется) / npm / yarn

Установка и запуск локально
Клонируйте репозиторий:

Bash
git clone [https://github.com/jokutrx/crypto-analytics-hub.git](https://github.com/jokutrx/crypto-analytics-hub.git)
cd crypto-analytics-hub
Установите зависимости:

Bash
pnpm install
Запустите сервер для разработки:

Bash
pnpm dev
Приложение откроется по адресу http://localhost:5173/crypto-analytics-hub/.

Деплой на GitHub Pages:

Bash
pnpm run deploy
🧪 Тестирование
Для проверки работы бизнес-логики и утилит используются юнит-тесты на Vitest:

Bash
# Однократный прогон всех тестов
pnpm test

# Запуск тестов в режиме наблюдения (watch)
pnpm test:watch