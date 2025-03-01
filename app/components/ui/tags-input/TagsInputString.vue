<script setup lang="ts">
import type { TagsInputRootEmits, TagsInputRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TagsInputRoot, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps<Omit<TagsInputRootProps, 'modelValue'> & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<TagsInputRootEmits>()

const model = defineModel<string>()
const value = computed({
  get: () => model.value?.split(',') || [],
  set: (value) => {
    model.value = value.join(',')
  },
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TagsInputRoot
    v-bind="forwarded"
    v-model="value"
    :class="cn('flex flex-wrap gap-2 items-center rounded-md border border-input bg-background px-3 py-2 text-sm', props.class)"
  >
    <slot />
  </TagsInputRoot>
</template>
