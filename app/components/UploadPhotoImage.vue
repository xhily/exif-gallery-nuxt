<script setup lang="ts">
defineProps<{
  file?: File
  type: string
}>()

function getBlobUrl(file: File): string {
  return URL.createObjectURL(file)
}
</script>

<template>
  <div class="flex flex-col items-center gap-1 opacity-50">
    <img
      v-if="file"
      :src="getBlobUrl(file)"
      :alt="file.name"
      class="w-24 h-24 object-cover rounded"
    >
    <div v-else class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
      <span class="text-sm text-gray-400">{{ type }}</span>
    </div>
    <span class="text-xs text-gray-500">{{ type }}</span>
    <span v-if="file" class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
  </div>
</template>

<style scoped>

</style>
