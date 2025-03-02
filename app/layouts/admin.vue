<script setup lang="ts">
const { path } = toRefs(useRoute())

const links = [{
  icon: 'i-lucide-layout-grid',
  to: '/admin',
}, {
  icon: 'i-lucide-upload',
  to: '/admin/upload',
}]
const disconnect = ref(false)
const { loggedIn, clear } = useUserSession()

async function clearSession() {
  disconnect.value = true
  await clear().finally(() => disconnect.value = false)
  navigateTo('/admin/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 h-12 w-full flex items-center justify-between border-b bg-background/60 px-4 backdrop-blur border-grid">
    <nav div class="flex items-center gap-4">
      <div class="flex items-center">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="h-7 flex items-center justify-center rounded-full px-4 text-center text-sm text-muted-foreground font-medium transition-colors data-[active=true]:bg-muted data-[active=true]:text-primary hover:text-primary"
          :data-active="path === link.to"
        >
          <div :class="link.icon" />
        </NuxtLink>
      </div>
    </nav>
    <nav class="min-w-0 flex flex-auto items-center">
      <NuxtLink to="https://github.com/wiidede/exif-gallery-nuxt" target="_blank" class="ml-auto">
        <Button
          variant="ghost"
          size="icon"
        >
          <div class="i-lucide-github op-50" />
        </Button>
      </NuxtLink>
      <ThemePopover class="flex-shrink-0" />
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
      <NuxtLink to="/" class="ms-1 min-w-0 truncate">
        Wiidede Gallery
      </NuxtLink>
    </nav>
  </header>
  <slot />
</template>
