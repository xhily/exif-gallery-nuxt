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
}
</script>

<template>
  <header class="sticky top-0 z-50 h-14 w-full flex items-center justify-between gap-4 border-b bg-background/60 px-4 backdrop-blur border-grid">
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
    <div class="flex items-center gap-1">
      <ThemePopover />
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
      <NuxtLink to="/">
        <div class="ms-1">
          Logo
        </div>
      </NuxtLink>
    </div>
  </header>
  <div v-if="!loggedIn" class="h-80dvh flex items-center justify-center p-4">
    <LoginForm />
  </div>
  <slot v-else />
</template>
