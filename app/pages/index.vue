<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const deletingImg = ref('')

const { loggedIn } = useUserSession()

const LIMIT = 12

const { photos, hasMore, loadMore, loading, error } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

watch(error, (err) => {
  if (err)
    toast({ title: 'An error occurred', description: 'Failed to load photos', color: 'red' })
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
    .catch(() => toast({ title: 'An error occured', description: 'Please try again', color: 'red' }))
    .finally(() => deletingImg.value = '')
}

</script>

<template>
  <div>
    <section
      v-if="photos"
      class="relative p-4"
    >
      <ul
        v-if="photos && photos.length"
        class="flex flex-col md:px-20"
      >
        <li
          v-for="photo in photos"
          :key="photo.id"
          class="flex gap-4"
        >
          <div class="group relative flex-[2]">
            <Button
              v-if="loggedIn"
              :loading="deletingImg === photo.id"
              class="absolute right-4 top-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deletePhoto(photo.id)"
            >
              <div class="i-lucide-trash" />
            </Button>
            <NuxtLink
              :to="`/detail/${getPhotoImg(photo)}`"
            >
              <img
                v-if="photo"
                :src="`/photos/${getPhotoImg(photo)}`"
                class="border-image h-auto w-full rounded-md object-contain transition-all duration-200"
              >
            </NuxtLink>
          </div>
          <div class="sticky top-16 h-fit flex-[1]">
            {{ photo.title }}
          </div>
        </li>
        <template v-if="loading">
          <li v-for="i in LIMIT" :key="i">
            <Skeleton class="border-image h-auto w-full rounded-md object-contain transition-all duration-200" />
          </li>
        </template>
      </ul>
    </section>
    <div
      v-else
      class="z-10 flex items-center space-x-4"
    >
      <Skeleton
        class="bg-primary-500 h-12 w-12"
        :ui="{ rounded: 'rounded-full' }"
      />
      <div class="space-y-2">
        <Skeleton class="bg-primary-500 h-4 w-[250px]" />
        <Skeleton class="bg-primary-500 h-4 w-[200px]" />
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
