<script setup lang="ts">
// !important: Need to use `group` in the parent element to make the animation work
import { cn } from '~/lib/utils'

interface BorderBeamProps {
  class?: string
  width?: string
  height?: string
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
}

const props = withDefaults(defineProps<BorderBeamProps>(), {
  width: '50%',
  height: '50%',
  duration: 10,
  anchor: 90,
  borderWidth: 2,
  colorFrom: '#ffaa40',
  colorTo: '#9c40ff',
})

const durationInSeconds = computed(() => `${props.duration}s`)
const delayInSeconds = computed(() => `-${props.duration / 2}s`)
</script>

<template>
  <div
    :class="
      cn(
        'border-beam',
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]',
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square after:w-[--width] after:h-[--height] animate-border-beam after-content-empty after:[background:radial-gradient(at_right_center,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_60px)]',
        'after:op-0 !group-hover:after:animate-running !group-hover:after:op-100',
        'before:absolute before:aspect-square before:w-[--width] before:h-[--height] animate-border-beam before-content-empty before:[animation-delay:var(--delay)]! before:[background:radial-gradient(at_right_center,var(--color-from),var(--color-to),transparent)] before:[offset-anchor:calc(var(--anchor)*1%)_50%] before:[offset-path:rect(0_auto_auto_0_round_60px)]',
        'before:op-0 !group-hover:before:animate-running !group-hover:before:op-100',
        props.class,
      )
    "
  />
</template>

<style scoped>
.border-beam {
  --width: v-bind(width);
  --height: v-bind(height);
  --duration: v-bind(durationInSeconds);
  --anchor: v-bind(anchor);
  --border-width: v-bind(borderWidth);
  --color-from: v-bind(colorFrom);
  --color-to: v-bind(colorTo);
  --delay: v-bind(delayInSeconds);
}

.animate-border-beam::after {
  animation: border-beam-anim var(--duration) infinite linear paused;
}
.animate-border-beam::before {
  animation: border-beam-anim var(--duration) infinite linear paused;
}

@keyframes border-beam-anim {
  to {
    offset-distance: 100%;
  }
}
</style>
