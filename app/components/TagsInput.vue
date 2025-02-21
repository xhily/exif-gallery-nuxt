<script setup lang="ts">
const modelValue = defineModel<string>()

const tags = computed<string[]>({
  get: () => {
    if (!modelValue.value)
      return ['', '', '']
    const tagList = modelValue.value.split(',').slice(0, 3).map(tag => tag.trim())
    while (tagList.length < 3) {
      tagList.push('')
    }
    return tagList
  },
  set: (newTags) => {
    const filteredTags = newTags.filter(tag => tag.trim() !== '')
    modelValue.value = filteredTags.join(',')
  },
})
</script>

<template>
  <div class="flex gap-2">
    <UInput
      v-for="(_tag, index) in tags"
      :id="createCuid()"
      :key="index"
      v-model="tags[index]"
      :placeholder="`标签 ${index + 1}`"
      class="flex-1"
    />
  </div>
</template>
