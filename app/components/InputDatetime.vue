<script setup lang="ts">
const model = defineModel<Date>()

function toDateTimeLocal(date?: Date): string {
  if (!date)
    return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function fromDateTimeLocal(value?: string): Date | undefined {
  if (!value)
    return undefined
  return new Date(value)
}

const dateTimeValue = computed({
  get: () => toDateTimeLocal(model.value), // 从 Date 转换为字符串
  set: (newValue: string) => {
    model.value = fromDateTimeLocal(newValue) // 从字符串转换为 Date
  },
})
</script>

<template>
  <Input v-model="dateTimeValue" type="datetime-local" />
</template>
