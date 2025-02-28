<script setup lang="ts">
defineProps<{
  file?: File | 'loading'
  type: string
}>()

function getBlobUrl(file: File): string {
  return URL.createObjectURL(file)
}
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <Skeleton v-if="file === 'loading'" class="h-24 w-24 rounded" />
    <img
      v-else-if="file"
      :src="getBlobUrl(file)"
      :alt="file.name"
      class="h-24 w-24 rounded object-cover"
    >
    <div v-else class="h-24 w-24 flex items-center justify-center rounded bg-gray-100">
      <span class="text-sm text-gray-400">{{ type }}</span>
    </div>
    <span class="text-xs text-gray-500">{{ type }}</span>
    <span v-if="file && file !== 'loading'" class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
  </div>
</template>

<style scoped>

</style>
