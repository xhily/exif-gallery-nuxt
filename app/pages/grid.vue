<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const currentPhoto = useState<string>('currentPhoto', () => ref(''))

const LIMIT = 36
const params = {
  hidden: false,
}
const { photos, hasMore, loadMore, loading } = usePhotosInfinite(params, LIMIT)
const { data: initPhotos } = await useFetch('/api/photos', {
  params: {
    ...params,
    limit: LIMIT,
    offset: photos.value.length,
  },
})
if (initPhotos.value) {
  if (initPhotos.value.data.length < LIMIT)
    hasMore.value = false
  photos.value.push(...initPhotos.value.data.map(deserializePhoto))
}

useInfiniteScroll(window, loadMore, { distance: 10, canLoadMore: () => hasMore.value })

function getPhotoThumbnail(photo: Photo) {
  const path = photo.thumbnail || photo.jpeg || photo.webp || photo.avif
  if (!path)
    throw new Error('Photo has no Image File')
  return path
}
</script>

<template>
  <section class="relative p-4">
    <div class="flex gap-4 md:gap-8">
      <div class="grid grid-cols-3 h-min flex-auto gap-1 2xl:grid-cols-8 lg:grid-cols-5 sm:grid-cols-4 xl:grid-cols-6">
        <PhotoItemCard
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          :translate-z="66"
          :image-class="{ 'current-image': currentPhoto === photo.id }"
        >
          <NuxtLinkLocale
            :to="`/p/${photo.id}`"
          >
            <img
              v-if="photo"
              :src="`/photos/${getPhotoThumbnail(photo)}`"
              :class="{ 'current-image': currentPhoto === photo.id }"
              class="aspect-[4/3] w-full rounded-lg object-cover"
              @click="currentPhoto = photo.id"
            >
          </NuxtLinkLocale>
        </PhotoItemCard>
        <template v-if="loading">
          <Skeleton
            v-for="i in LIMIT"
            :key="i"
            class="aspect-[4/3] w-full rounded-lg"
          />
        </template>
      </div>
      <div class="sticky top-16 h-min flex-shrink-0 md:pr-10">
        <ScrollArea class="max-h-[calc(100vh-5rem)] flex" viewport-class="h-inherit">
          <Tags />
        </ScrollArea>
      </div>
    </div>
    <div v-if="!loading && !photos?.length" class="m-auto h-66vh flex flex-col items-center justify-center gap4 p4">
      <h2>{{ $t('no_photos') }}</h2>
      <NuxtLinkLocale to="/admin">
        <Button>{{ $t('go_to_admin') }}</Button>
      </NuxtLinkLocale>
    </div>
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
