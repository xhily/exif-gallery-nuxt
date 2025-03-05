<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const {
  photo,
  class: className,
} = defineProps<{
  photo?: Photo
  class?: HTMLAttributes['class']
  imageClass?: HTMLAttributes['class']
}>()
</script>

<template>
  <ThreeDCardContainer :container-class="cn('relative z-48 hover:z-49', className)">
    <ThreeDCardBody>
      <ThreeDCardItem :translate-z="100">
        <slot>
          <picture v-if="photo">
            <source v-if="photo.avif" :srcset="`/photos/${photo.avif}`" type="image/avif">
            <source v-if="photo.webp" :srcset="`/photos/${photo.webp}`" type="image/webp">
            <img
              :src="`/photos/${photo.jpeg || photo.webp || photo.avif}`"
              :class="cn('h-auto w-full rounded-lg object-contain max-h-[calc(100vh-5rem)]', imageClass)"
            >
          </picture>
        </slot>
      </ThreeDCardItem>
    </ThreeDCardBody>
  </ThreeDCardContainer>
</template>

<style scoped>

</style>
