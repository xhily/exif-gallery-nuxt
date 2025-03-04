<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const id = route.params.id?.[0]
if (!id) {
  router.push('/')
  throw new Error('id is required')
}

const { loggedIn } = useUserSession()

const { photo } = usePhoto(id)
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
