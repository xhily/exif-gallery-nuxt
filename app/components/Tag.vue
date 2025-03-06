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
      <span>{{ label }}</span>
    </slot>
  </div>
</template>

<style scoped>

</style>
