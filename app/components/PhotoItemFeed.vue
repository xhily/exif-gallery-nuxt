<script setup lang="ts">
const {
  as = 'div',
  photo,
} = defineProps<{
  as?: string
  photo: Photo
  loggedIn?: boolean
}>()

const deletingImg = ref('')

async function deletePhoto(id: string) {
  deletingImg.value = id

  await $fetch(`/api/photos/${id}`, { method: 'DELETE' })
    .catch(() => toast.error('An error occured', { description: 'Please try again' }))
    .finally(() => deletingImg.value = '')
}
</script>

<template>
  <component
    :is="as"
    class="flex gap-1 lt-md:flex-col md:gap-4"
  >
    <div class="group relative md:flex-[2]">
      <Button
        v-if="loggedIn"
        :loading="deletingImg === photo.id"
        class="absolute right-4 top-4 z-[9999] opacity-0 group-hover:opacity-100"
        @click="deletePhoto(photo.id)"
      >
        <div class="i-lucide-trash" />
      </Button>
      <NuxtLink
        :to="`/detail/${photo.id}`"
      >
        <picture>
          <source v-if="photo.avif" :srcset="`/photos/${photo.avif}`" type="image/avif">
          <source v-if="photo.webp" :srcset="`/photos/${photo.webp}`" type="image/webp">
          <img
            :src="`/photos/${photo.jpeg || photo.webp || photo.avif}`"
            class="h-auto w-full rounded-lg object-contain transition-all duration-200"
          >
        </picture>
      </NuxtLink>
    </div>
    <div class="sticky top-16 h-fit md:flex-[1]">
      <div class="mb-2 flex md:flex-col lt-md:justify-between md:gap-2">
        <div>
          <h3> {{ photo.title }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ photo.caption }}
          </p>
        </div>
        <div>actions</div>
      </div>

      <div class="flex text-sm text-muted-foreground md:flex-col lt-md:justify-between md:gap-2">
        <div class="flex flex-col space-x-1">
          <span class="mb-1">{{ formatDate(photo.takenAt) }}</span>
          <span>{{ formatCameraText(photo) }}</span>
          <Tag
            v-for="tag in photo.tags?.split(',') || []"
            :key="tag"
            :label="tag"
          />
        </div>
        <div class="flex flex-col text-sm text-muted-foreground">
          <div class="flex gap-2">
            <span>{{ photo.focalLength ? toFixed(photo.focalLength, 1) : '--' }}mm</span>
            <span
              v-if="photo.focalLengthIn35mmFormat"
              title="35mm equivalent"
              class="op-50"
            >{{ photo.focalLengthIn35mmFormat }}mm</span>
          </div>
          <span
            v-for="meta, idx in formatExposure(photo)"
            :key="idx"
          >{{ meta }}</span>
          <li>{{ photo.exposureCompensation ? `${photo.exposureCompensation > 0 ? '+' : ''}${photo.exposureCompensation.toFixed(1)}ev` : '0ev' }}</li>
        </div>
      </div>
    </div>
  </component>
</template>

<style scoped>

</style>
