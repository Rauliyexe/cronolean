import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'pwa-icon.svg',
        'apple-touch-icon.png',
        'icons.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],
      manifest: {
        name: 'CronoLean — Cronoanálise Industrial & Balanceamento Lean',
        short_name: 'CronoLean',
        lang: 'pt-BR',
        description: 'Plataforma industrial para estudo de tempos, Takt Time, gráficos Yamazumi e balanceamento Lean em chão de fábrica.',
        theme_color: '#0a0f1d',
        background_color: '#050811',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        categories: ['productivity', 'business', 'utilities'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Cronômetro Industrial',
            short_name: 'Cronômetro',
            description: 'Cronometragem com ritmo e tolerâncias em tempo real',
            url: '/?view=stopwatch',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Gráficos Yamazumi',
            short_name: 'Yamazumi',
            description: 'Balanceamento de postos e subconjuntos vs Takt Time',
            url: '/?view=yamazumi',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Tabela de Tempos',
            short_name: 'Tempos',
            description: 'Matriz de tarefas com classificação VA/NVA',
            url: '/?view=tasks',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    host: true,
  },
})
