<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const {
  photo,
  class: className,
  translateZ = 100,
} = defineProps<{
  photo?: Photo
  class?: HTMLAttributes['class']
  imageClass?: HTMLAttributes['class']
  translateZ?: number
}>()
</script>

<template>
  <ThreeDCardContainer :container-class="cn('relative z-48 hover:z-49', className)">
    <ThreeDCardItem :translate-z="translateZ">
      <slot>
        <div class="max-h-[calc(100vh-5rem)] w-full" :style="{ aspectRatio: photo?.aspectRatio || undefined }">
          <picture v-if="photo">
            <source v-if="photo.avif" :srcset="`/photos/${photo.avif}`" type="image/avif">
            <source v-if="photo.webp" :srcset="`/photos/${photo.webp}`" type="image/webp">
            <img
              :src="`/photos/${photo.jpeg || photo.webp || photo.avif}`"
              :class="cn('h-full m-auto rounded-lg object-contain', imageClass)"
            >
          </picture>
        </div>
      </slot>
    </ThreeDCardItem>
  </ThreeDCardContainer>
</template>

<style scoped>

</style>
