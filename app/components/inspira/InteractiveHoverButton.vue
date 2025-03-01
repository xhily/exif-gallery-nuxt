<script lang="ts" setup>
import { cn } from '@/lib/utils'

interface Props {
  text?: string
  class?: string
  disabled?: boolean
  loading?: boolean
  left?: string
}
const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
})

const buttonRef = ref<HTMLButtonElement>()
</script>

<template>
  <button
    ref="buttonRef"
    :disabled="props.disabled"
    :class="
      cn(
        'group relative w-32 cursor-pointer overflow-hidden rounded-lg border bg-background p-2 text-center font-semibold',
        props.class,
        { 'op-50 cursor-default': props.disabled },
      )
    "
  >
    <span
      class="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
    >
      {{ text }}
    </span>

    <div
      class="absolute top-0 z-10 size-full flex translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1"
    >
      <span>{{ text }}</span>
      <div class="i-lucide-arrow-right text-6" />
    </div>
    <div
      class="absolute left-[18%] top-[40%] size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:size-full group-hover:scale-[1.8] group-hover:bg-primary"
      :class="{ 'animate-ping animate-delay-400': loading }"
      :style="{ left: props.left }"
    />
  </button>
</template>

<style></style>
