<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps({
  class: String,
})
</script>

<template>
  <div
    :class="cn('w-full', $props.class)"
    style="transform-style: preserve-3d"
  >
    <slot />
  </div>
</template>
