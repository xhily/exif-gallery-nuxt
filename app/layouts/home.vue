<script setup lang="ts">
const { path } = toRefs(useRoute())

const links = [
  {
    icon: 'i-lucide-monitor',
    to: '/',
  },
  {
    icon: 'i-lucide-layout-grid',
    to: '/grid',
  },
]
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
      <NuxtLink to="/admin">
        <Button
          variant="ghost"
          size="icon"
        >
          <div class="i-lucide-lock" />
        </Button>
      </NuxtLink>
      <NuxtLink to="/">
        <div class="ms-1">
          Logo
        </div>
      </NuxtLink>
    </div>
  </header>
  <slot />
</template>
