<script setup lang="ts">
const { data } = await useFetch('/api/tags', {
  key: '/api/tags',
})
const tags = computed(() => data.value?.data)
</script>

<template>
  <div class="flex flex-col gap-1 text-sm text-muted-foreground">
    <NuxtLink
      v-for="tag in tags"
      :key="tag.id"
      :to="`/tag/${tag.name}`"
      class="w-fit rounded-lg bg-muted px-1 transition-colors"
    >
      <Tag :label="tag.name" />
    </NuxtLink>
  </div>
</template>
