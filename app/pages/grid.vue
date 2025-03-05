<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const currentPhoto = useState<string>('currentPhoto', () => ref(''))

const { loggedIn } = useUserSession()

const LIMIT = 36
const { photos, hasMore, loadMore, loading } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

useInfiniteScroll(window, loadMore, { distance: 10, canLoadMore: () => hasMore.value })

// Initial load
onMounted(() => loadMore())

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
  <section class="relative flex gap-4 p-4">
    <div
      v-if="photos && photos.length"
      class="grid grid-cols-3 flex-[3] gap-1 md:grid-cols-4"
    >
      <PhotoItemCard
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
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
        <li v-for="i in LIMIT" :key="i">
          <Skeleton class="border-image aspect-[4/3] w-full rounded-md object-contain transition-all duration-200" />
        </li>
      </template>
    </div>
    <div class="sticky top-16 h-fit flex-[1]">
      tags
    </div>
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
