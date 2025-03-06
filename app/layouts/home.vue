<script setup lang="ts">
const config = useRuntimeConfig()
const { path } = toRefs(useRoute())

const links = [
  {
    icon: 'i-lucide-gallery-vertical',
    to: '/',
  },
  {
    icon: 'i-lucide-layout-grid',
    to: '/grid',
  },
]
</script>

<template>
  <header class="sticky top-0 z-50 h-12 w-full flex items-center justify-between border-b bg-background/60 px-4 backdrop-blur border-grid">
    <nav div class="min-w-0 flex flex-auto items-center justify-items-start">
      <NuxtLinkLocale to="/" class="me-2 min-w-0 flex-[0_1_auto] truncate font-medium">
        {{ config.public.title || $t('title') }}
      </NuxtLinkLocale>
      <NuxtLinkLocale
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="h-7 flex items-center justify-center rounded-full px-4 text-center text-sm font-medium transition-colors data-[active=true]:bg-muted data-[active=true]:text-primary hover:text-primary"
        :data-active="path === link.to"
      >
        <div :class="link.icon" />
      </NuxtLinkLocale>
    </nav>
    <nav class="flex items-center">
      <NuxtLinkLocale to="https://github.com/wiidede/exif-gallery-nuxt" target="_blank">
        <Button
          variant="ghost"
          size="icon"
        >
          <div class="i-lucide-github op-50" />
        </Button>
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/admin">
        <Button
          variant="ghost"
          size="icon"
        >
          <div class="i-lucide-server-cog op-50" />
        </Button>
      </NuxtLinkLocale>
      <ThemePopover class="flex-shrink-0" />
    </nav>
  </header>
  <slot />
</template>
