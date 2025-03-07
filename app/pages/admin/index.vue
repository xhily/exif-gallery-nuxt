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
  <div class="p-4 space-y-4">
    <NuxtLinkLocale to="/admin/upload">
      <div class="group relative w-full flex flex-col items-center justify-center overflow-hidden border border-muted rounded-lg bg-background p-4 md:shadow-xl">
        <span class="pointer-events-none my-8 whitespace-pre-wrap from-black to-gray-300/80 bg-gradient-to-b bg-clip-text text-center text-5xl text-transparent font-semibold leading-none dark:from-white dark:to-slate-900/10">
          {{ $t('go_to_upload') }}
        </span>
        <BorderBeam
          color-from="hsl(var(--primary))"
          color-to="hsl(var(--primary-foreground))"
          :duration="2"
          :border-width="4"
        />
      </div>
    </NuxtLinkLocale>
    <div
      v-if="photos && photos.length"
      class="grid grid-cols-3 gap-1 2xl:grid-cols-8 lg:grid-cols-5 sm:grid-cols-4 xl:grid-cols-6"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="group relative aspect-[4/3] h-auto w-full flex"
      >
        <Button
          v-if="loggedIn"
          size="icon"
          :loading="deletingPhoto === photo.id"
          class="absolute right--1 top--1 z-[9999] opacity-0 sm:right-4 sm:top-4 group-hover:opacity-100"
          @click="deletePhoto(photo.id)"
        >
          <div class="i-lucide-trash" />
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
