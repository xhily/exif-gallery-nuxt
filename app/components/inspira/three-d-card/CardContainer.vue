<script setup lang="ts">
import { provide } from 'vue'
import { useMouseState } from '~/composables/useMouseState'

defineProps({
  class: String,
  containerClass: String,
})

const containerRef = useTemplateRef('containerRef')
const innerRef = useTemplateRef('innerRef')

const mouseState = useMouseState() // Use the composable
provide('use3DCardMouseState', mouseState)

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value || !innerRef.value)
    return
  const { left, top, width, height } = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - left - width / 2) / (width / 2) * 15
  const y = (e.clientY - top - height / 2) / (height / 2) * 15
  innerRef.value.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
}

function handleMouseEnter() {
  mouseState.setMouseEntered(true)
}

function handleMouseLeave() {
  if (!innerRef.value)
    return

  mouseState.setMouseEntered(false)
  innerRef.value.style.transform = `rotateY(0deg) rotateX(0deg)`
}
</script>

<template>
  <div
    ref="containerRef"
    :class="[containerClass]"
    style="perspective: 1000px"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="innerRef"
      class="relative transition-all duration-200 ease-linear" :class="[
        $props.class,
      ]"
      style="transform-style: preserve-3d"
    >
      <slot />
    </div>
  </div>
</template>
