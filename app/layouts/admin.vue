<script setup lang="ts">
const links = [
  [{
    label: 'Photos',
    icon: 'i-heroicons-squares-2x2',
    to: '/admin',
  }, {
    label: 'Upload',
    icon: 'i-heroicons-arrow-up-tray',
    to: '/admin/upload',
  }],
  [{
    label: 'Home',
    icon: 'i-heroicons-tv',
    to: '/',
  }],
]
</script>

<template>
  <UHorizontalNavigation :links="links" class="sticky top-0 z-[99] border-b border-gray-200 dark:border-gray-800" />
  <slot />
</template>
