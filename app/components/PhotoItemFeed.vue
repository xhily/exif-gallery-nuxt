<script setup lang="ts">
const {
  photo,
} = defineProps<{
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
  <div>
    <div class="flex gap-1 lt-md:flex-col lg:gap-8 md:gap-4">
      <ThreeDCardContainer container-class="md:flex-[2] xl:flex-[3] relative hover:z-49">
        <ThreeDCardBody>
          <ThreeDCardItem :translate-z="100">
            <picture>
              <source v-if="photo.avif" :srcset="`/photos/${photo.avif}`" type="image/avif">
              <source v-if="photo.webp" :srcset="`/photos/${photo.webp}`" type="image/webp">
              <img
                :src="`/photos/${photo.jpeg || photo.webp || photo.avif}`"
                class="h-auto w-full rounded-lg object-contain transition-all duration-200"
              >
            </picture>
          </ThreeDCardItem>
        </ThreeDCardBody>
      </ThreeDCardContainer>

      <div class="relative sticky top-16 z-1 h-fit md:flex-[1]">
        <div class="mb-2 flex md:flex-col lt-md:justify-between md:gap-2">
          <div>
            <h3> {{ photo.title }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ photo.caption }}
            </p>
          </div>
          <div>
            <NuxtLink
              :to="`/detail/${photo.id}`"
            >
              detail
            </NuxtLink>
            <Button
              v-if="loggedIn"
              :loading="deletingImg === photo.id"
              class="absolute right-4 top-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deletePhoto(photo.id)"
            >
              <div class="i-lucide-trash" />
            </Button>
          </div>
        </div>

        <div class="flex text-sm text-muted-foreground md:flex-col lt-md:justify-between md:gap-2">
          <div class="flex flex-col space-y-1">
            <span>{{ formatDate(photo.takenAt) }}</span>
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
    </div>
  </div>
</template>

<style scoped>

</style>
