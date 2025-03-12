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
  mini?: boolean
}>()
</script>

<template>
  <ThreeDCardContainer :container-class="cn('z-48 hover:z-49', { 'h-full': mini }, className)" :class="mini ? 'h-full' : ''">
    <ThreeDCardItem :translate-z="translateZ" :class="mini ? 'h-full' : ''">
      <slot>
        <div
          class="max-h-[calc(100vh-5rem)]"
          :class="mini ? 'h-full' : 'w-full'"
          :style="{ aspectRatio: !mini && photo?.aspectRatio || undefined }"
        >
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
