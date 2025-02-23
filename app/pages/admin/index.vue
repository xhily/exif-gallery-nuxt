<script setup lang="ts">
const disconnect = ref(false)

const toast = useToast()
const { photos } = usePhotos()
const { loggedIn, clear } = useUserSession()

function getPhotoThumbnail(photo: Photo) {
  const path = photo.thumbnail || photo.jpeg || photo.webp || photo.avif
  if (!path)
    throw new Error('Photo has no Image File')
  return path
}
async function deleteFile(pathname: string) {
  await $fetch(`/api/photos/${pathname}`, { method: 'DELETE' })
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

      <div class="w-full">
        <div class="text-8xl h-100 rd bg-gray">
          Upload Photos
        </div>

        <ul
          v-if="photos && photos.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <li
            v-for="photo in photos"
            :key="getPhotoThumbnail(photo)"
            class="relative group"
          >
            <img
              :src="`/photos/${getPhotoThumbnail(photo)}`"
              class="w-full h-48 object-cover rounded-md"
              alt=""
            >
            <UButton
              :loading="false"
              color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              @click="deleteFile(getPhotoThumbnail(photo))"
            />
          </li>
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
