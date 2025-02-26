<script setup lang="ts">
import colors from 'tailwindcss/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()

const grayColors = (colors)[appConfig.ui.gray as keyof typeof colors] || colors.zinc

const color = computed(() => colorMode.value === 'dark' ? grayColors[900] : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'NuxtHub Image Gallery Starter'
const description = 'A Nuxt template to build your full-stack image gallery application on the edge.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogSiteName: 'NuxtHub image gallery template',
  ogImage: 'https://image-gallery.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div
    class="min-h-[100dvh] relative"
    :class="{ 'flex flex-col md:block': $router.currentRoute.value.fullPath !== '/' }"
  >
    <UNotifications />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
