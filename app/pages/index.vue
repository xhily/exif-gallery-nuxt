<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const currentPhoto = useState<string>('currentPhoto', () => ref(''))

const { loggedIn } = useUserSession()

const LIMIT = 12

const { photos, hasMore, loadMore, loading, error } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

watch(error, (err) => {
  if (err)
    toast.error('An error occurred', { description: 'Failed to load photos' })
})

useInfiniteScroll(window, loadMore, { distance: 10, canLoadMore: () => hasMore.value })
</script>

<template>
  <section
    v-if="photos"
    class="relative p-4"
  >
    <div
      v-if="photos && photos.length"
      class="flex flex-col gap-4 xl:px-20"
    >
      <PhotoItem
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
        :logged-in="loggedIn"
        :image-class="{ 'current-image': currentPhoto === photo.id }"
      >
        <template #action-button>
          <NuxtLink
            :to="`/detail/${photo.id}`"
          >
            <Button
              v-if="loggedIn"
              size="icon"
              variant="ghost"
              title="Image detail"
              class="text-muted-foreground"
              @click="currentPhoto = photo.id"
            >
              <div class="i-lucide-image-upscale" />
            </Button>
          </NuxtLink>
        </template>
      </PhotoItem>
      <template v-if="loading">
        <li v-for="i in LIMIT" :key="i">
          <Skeleton class="aspect-[4/3] h-auto w-full rounded-lg" />
        </li>
      </template>
    </div>
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
