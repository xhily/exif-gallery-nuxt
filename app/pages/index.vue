<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const currentPhoto = useState<string>('currentPhoto', () => ref(''))

const { loggedIn } = useUserSession()

const LIMIT = 12
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
</script>

<template>
  <section class="relative p-4">
    <div class="flex flex-col gap-4 xl:px-20">
      <PhotoItem
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
        :logged-in="loggedIn"
        :image-class="{ 'current-image': currentPhoto === photo.id }"
        @deleted="photos = photos.filter(p => p.id !== $event)"
      >
        <template #action-button>
          <NuxtLinkLocale
            :to="`/p/${photo.id}`"
          >
            <TooltipIconButton
              :label="$t('button.view_photo')"
              icon="i-lucide-image-upscale text-muted-foreground"
              @click="currentPhoto = photo.id"
            />
          </NuxtLinkLocale>
        </template>
      </PhotoItem>
      <template v-if="loading">
        <Skeleton
          v-for="i in LIMIT"
          :key="i"
          class="aspect-[4/3] w-full rounded-lg"
        />
      </template>
      <div v-if="!loading && !photos?.length" class="m-auto h-66vh flex flex-col items-center justify-center gap4">
        <h2>{{ $t('no_photos') }}</h2>
        <NuxtLinkLocale to="/admin">
          <Button>{{ $t('go_to_admin') }}</Button>
        </NuxtLinkLocale>
      </div>
    </div>
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
