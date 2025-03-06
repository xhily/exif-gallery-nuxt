<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const route = useRoute()
const localePath = useLocalePath()

const id = route.params.id?.[0]
if (!id) {
  navigateTo(localePath('/'))
  throw new Error('id is required')
}

const { loggedIn } = useUserSession()

const { photo } = usePhoto(id)

const photosStore = useState<Map<string, any>>('infiniteData', () => shallowRef(new Map()))

function onDeleted() {
  navigateTo(localePath('/'))
  photosStore.value = shallowRef(new Map()).value
}
</script>

<template>
  <section
    v-if="photo"
    class="relative p-4"
  >
    <PhotoItem
      :photo="photo"
      :logged-in="loggedIn"
      image-class="current-image"
      @deleted="onDeleted()"
    />
  </section>
  <section v-else>
    <Skeleton class="aspect-[4/3] w-full" />
  </section>
</template>

<style scoped>
.current-image {
  view-transition-name: vtn-image;
}
</style>
