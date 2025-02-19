<script setup lang="ts">
const { photos } = usePhotos({ uploading: true })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">
      待处理图片列表
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="photo in photos" :key="photo.id" class="relative">
        <img :src="`/images/${photo.pathname}`" :alt="photo.fileName" class="w-full h-48 object-cover rounded-lg shadow-md">
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
          <p class="text-sm truncate">
            {{ photo.fileName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
