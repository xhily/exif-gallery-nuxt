<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const { loggedIn } = useUserSession()

const LIMIT = 12

const { photos, hasMore, loadMore, loading, error } = usePhotosInfinite({
  hidden: false,
}, LIMIT)

watch(error, (err) => {
  if (err)
    toast.error('An error occurred', { description: 'Failed to load photos' })
})

useInfiniteScroll(window, loadMore, { distance: 10, canLoadMore: () => hasMore.value })
</script>

<template>
  <section
    v-if="photos"
    class="relative p-4"
  >
    <ul
      v-if="photos && photos.length"
      class="flex flex-col gap-4 xl:px-20"
    >
      <PhotoItemFeed
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
        :logged-in="loggedIn"
      />
      <template v-if="loading">
        <li v-for="i in LIMIT" :key="i">
          <Skeleton class="border-image h-auto w-full rounded-md object-contain transition-all duration-200" />
        </li>
      </template>
    </ul>
  </section>
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
