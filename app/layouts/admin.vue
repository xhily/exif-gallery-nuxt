<script setup lang="ts">
const config = useRuntimeConfig()
const { path } = toRefs(useRoute())
const localePath = useLocalePath()

const links = [{
  icon: 'i-lucide-layout-grid',
  to: localePath('/admin'),
}, {
  icon: 'i-lucide-upload',
  to: localePath('/admin/upload'),
}]
const disconnect = ref(false)
const { loggedIn, clear } = useUserSession()

async function clearSession() {
  disconnect.value = true
  await clear().finally(() => disconnect.value = false)
  navigateTo(localePath('/admin/login'))
}
</script>

<template>
  <header class="sticky top-0 z-50 h-12 w-full flex items-center justify-between border-b bg-background/60 px-4 backdrop-blur border-grid">
    <nav div class="min-w-0 flex flex-auto items-center justify-items-start">
      <NuxtLinkLocale to="/" class="me-2 min-w-0 flex-[0_1_auto] truncate font-medium">
        {{ config.public.title || $t('title') }}
      </NuxtLinkLocale>
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="h-7 flex items-center justify-center rounded-full px-4 text-center text-sm font-medium transition-colors data-[active=true]:bg-muted data-[active=true]:text-primary hover:text-primary"
        :data-active="path === link.to"
      >
        <div :class="link.icon" />
      </NuxtLink>
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
      <Button
        v-if="loggedIn"
        :loading="disconnect"
        class="c-red"
        variant="ghost"
        size="icon"
        @click="clearSession"
      >
        <div class="i-lucide-power" />
      </Button>
      <ThemePopover class="flex-shrink-0" />
    </nav>
  </header>
  <slot />
</template>
