<script setup lang="ts">
const {
  icon = 'i-lucide-tag',
  label,
} = defineProps<{
  icon?: string
  label?: string
}>()
</script>

<template>
  <div class="flex items-center">
    <div :class="icon" class="me-1 size-1em" />
    <slot>
      <span class="max-w-24 truncate lt-sm:max-w-16">{{ label }}</span>
    </slot>
  </div>
</template>

<style scoped>

</style>
