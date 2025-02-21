<script setup lang="ts">
import { format as formatFn } from 'date-fns'

defineOptions({
  inheritAttrs: false,
})

const {
  format = 'yyyy-MM-dd HH:mm:ss',
} = defineProps<{
  format?: string
}>()

const date = defineModel<Date | undefined>({ required: true })

const attrs: Record<string, unknown> = useAttrs()
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton
      icon="i-heroicons-calendar-days-20-solid"
      :label="date ? formatFn(date, format) : ''"
    />

    <template #panel="{ close }">
      <DatePicker v-model="date" is-required v-bind="attrs" @close="close" />
    </template>
  </UPopover>
</template>
