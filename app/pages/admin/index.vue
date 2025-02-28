<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const disconnect = ref(false)

const { loggedIn, clear } = useUserSession()

const LIMIT = 36

const { photos, hasMore, loadMore, loading, error } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

watch(error, (err) => {
  if (err)
    toast({ title: 'An error occurred', description: 'Failed to load photos', color: 'red' })
})

useInfiniteScroll(window, loadMore, { distance: 10, canLoadMore: () => hasMore.value })

function getPhotoThumbnail(photo: Photo) {
  const path = photo.thumbnail || photo.jpeg || photo.webp || photo.avif
  if (!path)
    throw new Error('Photo has no Image File')
  return path
}

const deletingImg = ref<string>()
async function deletePhoto(id: string) {
  await $fetch(`/api/photos/${id}`, { method: 'DELETE' })
    .catch(() => toast({ title: 'An error occured', description: 'Please try again', color: 'red' }))
}

async function clearSession() {
  disconnect.value = true
  await clear().finally(() => disconnect.value = false)
}
</script>

<template>
  <div>
    <section
      v-if="loggedIn"
      class="relative min-h-screen p-4"
    >
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl text-white font-bold">
          Admin Panel
        </h1>
        <Button
          :loading="disconnect"
          class="c-red"
          variant="ghost"
          @click="clearSession"
        >
          <div class="i-lucide-power" />
        </Button>
      </div>

      <div
        class="w-full flex gap-4"
      >
        <ul
          v-if="photos && photos.length"
          class="grid grid-cols-4 flex-[3] gap-1 md:grid-cols-6"
        >
          <li
            v-for="photo in photos"
            :key="photo.id"
            class="group relative w-full"
          >
            <Button
              v-if="loggedIn"
              :loading="deletingImg === photo.id"
              class="absolute right-4 top-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deletePhoto(photo.id)"
            >
              <div class="i-lucide-trash" />
            </Button>
            <img
              v-if="photo"
              :src="`/photos/${getPhotoThumbnail(photo)}`"
              class="border-image aspect-[4/3] w-full rounded-md object-contain transition-all duration-200"
            >
          </li>
          <template v-if="loading">
            <li v-for="i in LIMIT" :key="i">
              <Skeleton class="border-image aspect-[4/3] w-full rounded-md object-contain transition-all duration-200" />
            </li>
          </template>
        </ul>
      </div>
    </section>
    <div
      v-else
      class="min-h-screen flex flex-col items-center justify-center"
    >
      <h1 class="mb-4 text-2xl text-white font-bold">
        Admin Access Required
      </h1>
      <NuxtLink
        to="/"
        class="text-blue-500 hover:text-blue-400"
      >
        Return to Gallery
      </NuxtLink>
    </div>
  </div>
</template>
