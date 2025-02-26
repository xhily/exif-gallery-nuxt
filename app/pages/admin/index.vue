<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const disconnect = ref(false)

const toast = useToast()
const { loggedIn, clear } = useUserSession()

const LIMIT = 36

const { photos, hasMore, loadMore, loading, error } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

watch(error, (err) => {
  if (err)
    toast.add({ title: 'An error occurred', description: 'Failed to load photos', color: 'red' })
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
    .catch(() => toast.add({ title: 'An error occured', description: 'Please try again', color: 'red' }))
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
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-white">
          Admin Panel
        </h1>
        <UButton
          :loading="disconnect"
          icon="i-heroicons-power-20-solid"
          color="red"
          variant="ghost"
          @click="clearSession"
        />
      </div>

      <div
        class="w-full flex gap-4"
      >
        <ul
          v-if="photos && photos.length"
          class="flex-[3] grid grid-cols-4 gap-1 md:grid-cols-6"
        >
          <li
            v-for="photo in photos"
            :key="photo.id"
            class="relative w-full group"
          >
            <UButton
              v-if="loggedIn"
              :loading="deletingImg === photo.id"
              color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-4 right-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deletePhoto(photo.id)"
            />
            <img
              v-if="photo"
              :src="`/photos/${getPhotoThumbnail(photo)}`"
              class="aspect-[4/3] w-full rounded-md transition-all duration-200 border-image object-contain"
            >
          </li>
          <template v-if="loading">
            <li v-for="i in LIMIT" :key="i">
              <USkeleton class="aspect-[4/3] w-full rounded-md transition-all duration-200 border-image object-contain" />
            </li>
          </template>
        </ul>
      </div>
    </section>
    <div
      v-else
      class="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 class="text-2xl font-bold text-white mb-4">
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
