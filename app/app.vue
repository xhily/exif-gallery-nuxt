<script setup lang="ts">
const { theme } = useTheme(true)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const themeColor = computed(() => baseColors.find(c => c.name === theme.value)?.activeColor[isDark.value ? 'dark' : 'light'] || theme.value)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: themeColor.value },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'theme-zinc',
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
  <div class="relative min-h-[100dvh]">
    <Sonner :visible-toasts="20" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
