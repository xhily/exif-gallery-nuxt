<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const currentPhoto = useState<string>('currentPhoto', () => ref(''))

const { loggedIn } = useUserSession()

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

const { deletingPhoto, deletePhoto: _deletePhoto } = useDeletePhoto()
function deletePhoto(id: string) {
  _deletePhoto(id).then(() =>
    photos.value = photos.value.filter(photo => photo.id !== id),
  )
}
</script>

<template>
  <section class="relative p-4">
    <div class="flex gap-4 md:gap-8">
      <div class="grid grid-cols-3 flex-auto gap-1 2xl:grid-cols-8 lg:grid-cols-5 sm:grid-cols-4 xl:grid-cols-6">
        <PhotoItemCard
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          :translate-z="66"
          :logged-in="loggedIn"
          :image-class="{ 'current-image': currentPhoto === photo.id }"
        >
          <div class="group relative">
            <NuxtLink
              :to="`/detail/${photo.id}`"
            >
              <img
                v-if="photo"
                :src="`/photos/${getPhotoThumbnail(photo)}`"
                :class="{ 'current-image': currentPhoto === photo.id }"
                class="aspect-[4/3] w-full rounded-lg object-cover"
                @click="currentPhoto = photo.id"
              >
            </NuxtLink>
            <Button
              v-if="loggedIn"
              :loading="deletingPhoto === photo.id"
              class="absolute right-4 top-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deletePhoto(photo.id)"
            >
              <div class="i-lucide-trash" />
            </Button>
          </div>
        </PhotoItemCard>
        <template v-if="loading">
          <Skeleton
            v-for="i in LIMIT"
            :key="i"
            class="aspect-[4/3] w-full rounded-lg"
          />
        </template>
      </div>
      <div class="sticky top-16 h-fit flex-shrink-0 md:pr-10">
        <Tags />
      </div>
    </div>
    <div v-if="!loading && !photos?.length" class="m-auto h-66vh flex flex-col items-center justify-center gap4 p4">
      <h2>No Photos</h2>
      <NuxtLink to="/admin">
        <Button>Go To Admin Panel</Button>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
