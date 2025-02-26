<script setup lang="ts">
const links = [
  [{
    label: 'Feed View',
    icon: 'i-heroicons-tv',
    to: '/',
  }, {
    label: 'Grid View',
    icon: 'i-heroicons-squares-2x2',
    to: '/grid',
  }],
  [{
    label: 'Admin',
    icon: 'i-heroicons-lock-closed',
    to: '/admin',
  }],
]
</script>

<template>
  <header class="px-6 flex justify-between items-center gap-4 sticky top-0 z-[99] border-b border-gray-200 dark:border-gray-800">
    <div>Logo</div>
    <UHorizontalNavigation :links="links" />
    <div class="flex items-center">
      <ThemePicker />
      <ThemeColorMode />
    </div>
  </header>
  <slot />
</template>
