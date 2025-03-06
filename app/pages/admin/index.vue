<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { loggedIn } = useUserSession()

const LIMIT = 36
const { photos, hasMore, loadMore, loading } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

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
  <div class="w-full flex gap-4 p-4">
    <div
      v-if="photos && photos.length"
      class="grid grid-cols-4 flex-[3] gap-1 md:grid-cols-6"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="group relative aspect-[4/3] h-auto w-full flex"
      >
        <Button
          v-if="loggedIn"
          :loading="deletingPhoto === photo.id"
          class="absolute right-4 top-4 z-[9999] opacity-0 group-hover:opacity-100"
          @click="deletePhoto(photo.id)"
        >
          <div class="i-lucide-trash" /> {{ photo.aspectRatio }}
        </Button>
        <img
          v-if="photo"
          :src="`/photos/${getPhotoThumbnail(photo)}`"
          class="m-auto rounded-lg object-contain"
          :class="photo.aspectRatio ? photo.aspectRatio > (4 / 3) ? 'w-full h-auto' : 'h-full w-auto' : 'h-full w-full'"
        >
      </div>
      <template v-if="loading">
        <li v-for="i in LIMIT" :key="i">
          <Skeleton class="aspect-[4/3] w-full rounded-lg" />
        </li>
      </template>
    </div>
  </div>
</template>
