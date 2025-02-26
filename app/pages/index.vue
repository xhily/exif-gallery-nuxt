<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const isOpen = ref(false)
const deletingImg = ref('')
const disconnect = ref(false)

const toast = useToast()
const { loggedIn, clear } = useUserSession()

const LIMIT = 12

const { photos, hasMore, loadMore, loading, error } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

watch(error, (err) => {
  if (err)
    toast.add({ title: 'An error occurred', description: 'Failed to load photos', color: 'red' })
})

useInfiniteScroll(window, loadMore, { distance: 10, canLoadMore: () => hasMore.value })

function getPhotoImg(photo: Photo) {
  const path = photo.jpeg || photo.webp || photo.avif
  if (!path)
    throw new Error('Photo has no Image File')
  return path
}

async function deletePhoto(id: string) {
  deletingImg.value = id

  await $fetch(`/api/photos/${id}`, { method: 'DELETE' })
    .catch(() => toast.add({ title: 'An error occured', description: 'Please try again', color: 'red' }))
    .finally(() => deletingImg.value = '')
}

async function clearSession() {
  disconnect.value = true

  await clear().finally(() => disconnect.value = false)
}
</script>

<template>
  <div>
    <section
      v-if="photos"
      class="relative p-4"
    >
      <UModal
        v-model="isOpen"
        class="flex items-center justify-center relative"
        side="left"
      >
        <LoginForm
          class="z-50 bg-gray-800 rounded-md"
          @close="isOpen = false"
        />
      </UModal>

      <BottomMenu class="bottom-menu">
        <template #logo>
          <img
            src="/logo.svg"
            width="29"
            height="20"
          >
        </template>
        <template #description>
          <div class="flex gap-x-4 items-center">
            <p class="bottom-menu-description text-sm sm:text-base leading-tight sm:leading-normal">
              Media Gallery template
            </p>
            <NuxtLink
              to="https://github.com/Flosciante/nuxt-image-gallery"
              target="blank"
              class="flex items-center"
            >
              <UIcon
                name="i-simple-icons-github"
                class="w-5 h-5"
              />
            </NuxtLink>
          </div>
        </template>
        <template #buttons>
          <div class="flex gap-x-2">
            <UButton
              v-if="loggedIn"
              :loading="disconnect"
              icon="i-heroicons-power-20-solid"
              color="red"
              variant="ghost"
              @click="clearSession"
            />
            <UButton
              v-else
              label="Sign in"
              color="green"
              variant="ghost"
              aria-label="Sign in"
              class="mr-4 sm:mr-0"
              @click="isOpen = true"
            />
          </div>
        </template>
      </BottomMenu>

      <ul
        v-if="photos && photos.length"
        class="flex flex-col md:px-20"
      >
        <li
          v-for="photo in photos"
          :key="photo.id"
          class="flex gap-4"
        >
          <div class="relative group flex-[2]">
            <UButton
              v-if="loggedIn"
              :loading="deletingImg === photo.id"
              color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-4 right-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deletePhoto(photo.id)"
            />
            <NuxtLink
              :to="`/detail/${getPhotoImg(photo)}`"
            >
              <img
                v-if="photo"
                :src="`/photos/${getPhotoImg(photo)}`"
                class="w-full h-auto rounded-md transition-all duration-200 border-image object-contain"
              >
            </NuxtLink>
          </div>
          <div class="flex-[1] sticky top-16 h-fit">
            {{ photo.title }}
          </div>
        </li>
        <template v-if="loading">
          <li v-for="i in LIMIT" :key="i">
            <USkeleton class="w-full h-auto rounded-md transition-all duration-200 border-image object-contain" />
          </li>
        </template>
      </ul>
    </section>
    <div
      v-else
      class="flex items-center space-x-4 z-10"
    >
      <USkeleton
        class="h-12 w-12 bg-primary-500"
        :ui="{ rounded: 'rounded-full' }"
      />
      <div class="space-y-2">
        <USkeleton class="h-4 w-[250px] bg-primary-500" />
        <USkeleton class="h-4 w-[200px] bg-primary-500" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .imageEl {
    view-transition-name: vtn-image;
  }

  .bottom-menu-description {
    view-transition-name: vtn-bottom-menu-description;
  }

  .bottom-menu-button {
    view-transition-name: vtn-bottom-menu-button;
  }

  .container-image {
    background-color: rgba(255, 255, 255, 0.1)
  }
  .container-image:hover {
    background-color: transparent;
  }

  .border-image {
    border-width: 1.15px;
    border-color: rgba(255, 255, 255, 0.1)
  }
}
</style>
