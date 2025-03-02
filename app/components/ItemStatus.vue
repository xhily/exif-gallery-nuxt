<script setup lang="ts">
defineProps<{
  checked: boolean
  label: string
}>()
</script>

<template>
  <div class="flex items-center gap-1">
    <div v-show="checked" class="w-4 text-4 text-primary">
      <div class="i-lucide-check" />
    </div>
    <span :class="{ 'text-muted-foreground': !checked }">
      <slot>
        {{ label }}
      </slot>
    </span>
  </div>
</template>

<style scoped>

</style>
