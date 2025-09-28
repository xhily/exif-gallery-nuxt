<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const {
  class: className,
  translateZ = 100,
} = defineProps<{
  photo?: IPhoto
  class?: HTMLAttributes['class']
  imageClass?: HTMLAttributes['class']
  translateZ?: number
  mini?: boolean
}>()

const { disable3DCard } = useTheme()
</script>

<template>
  <slot v-if="disable3DCard">
    <PhotoItemCardDefault :photo="photo" :image-class="imageClass" :mini="mini" :class="cn({ 'h-full': mini }, className)" />
  </slot>
  <ThreeDCardContainer v-else :container-class="cn('z-48 hover:z-49', { 'h-full': mini }, className)" :class="mini ? 'h-full' : ''">
    <ThreeDCardItem :translate-z="translateZ" :class="mini ? 'h-full' : ''">
      <slot>
        <PhotoItemCardDefault :photo="photo" :image-class="imageClass" :mini="mini" />
      </slot>
    </ThreeDCardItem>
  </ThreeDCardContainer>
</template>

<style scoped>

</style>
