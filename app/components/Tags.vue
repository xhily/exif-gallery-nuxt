<script setup lang="ts">
const { data } = await useFetch('/api/tags', {
  key: '/api/tags',
})
const tags = computed(() => data.value?.data)
</script>

<template>
  <div class="flex flex-col gap-1 pr-10 text-sm text-muted-foreground">
    <NuxtLinkLocale
      v-for="tag in tags"
      :key="tag.id"
      :to="`/tag/${tag.name}`"
      class="group relative w-fit rounded-lg bg-muted px-1 transition-colors"
    >
      <Tag :label="tag.name" />
      <div class="absolute bottom-0 right-0 top-0 translate-x-full text-sm op-50 md:hidden md:group-hover:block">
        {{ tag.photoCount }}
      </div>
    </NuxtLinkLocale>
  </div>
</template>
