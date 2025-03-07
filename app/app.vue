<script setup lang="ts">
const { theme } = useTheme(true)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const themeColor = computed(() => baseColors.find(c => c.name === theme.value)?.activeColor[isDark.value ? 'dark' : 'light'] || theme.value)

onPrehydrate(() => {
  const value = localStorage.getItem('shadcn-theme')
  if (!value)
    return
  const oldClass = Array.from(document.body.classList).find(className => className.startsWith('theme-'))
  if (oldClass)
    document.body.classList.remove(oldClass)
  document.body.classList.add(`theme-${value}`)
})

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
    class: 'theme-blue font-sans',
  },
})
const config = useRuntimeConfig()
const { t } = useI18n()
const title = config.public.title || t('title')
const description = config.public.description || t('description')

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogSiteName: title,
  ogImage: 'https://photo.wiidede.space/exif-gallery-nuxt.jpg',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLoadingIndicator color="hsl(var(--primary))" />
  <div class="relative min-h-[100dvh]">
    <Sonner :visible-toasts="20" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
