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
    <div v-if="icon" :class="icon" class="me-1 size-1em" />
    <slot>
      {{ label }}
    </slot>
  </div>
</template>

<style scoped>

</style>
