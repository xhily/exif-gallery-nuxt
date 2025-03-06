<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const {
  photo,
} = defineProps<{
  photo: Photo
  loggedIn?: boolean
  imageClass?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  deleted: [id: string]
}>()

const { deletingPhoto, deletePhoto: _deletePhoto } = useDeletePhoto()
function deletePhoto(id: string) {
  _deletePhoto(id).then(() => emit('deleted', id))
}
</script>

<template>
  <div class="flex gap-1 lt-md:flex-col lg:gap-8 md:gap-4">
    <PhotoItemCard :photo="photo" class="md:flex-[2] xl:flex-[3]" :image-class="imageClass" />
    <div class="relative sticky top-16 z-1 h-fit md:flex-[1]">
      <div class="flex lt-md:mb-2 md:flex-col lt-md:justify-between">
        <div>
          <h3> {{ photo.title }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ photo.caption }}
          </p>
        </div>
        <div class="ml--2.4 min-h-2 flex items-center">
          <slot name="action-button" />
          <Button
            v-if="loggedIn"
            size="icon"
            variant="ghost"
            :loading="deletingPhoto === photo.id"
            class="text-muted-foreground"
            @click="deletePhoto(photo.id)"
          >
            <div class="i-lucide-trash" />
          </Button>
        </div>
      </div>

      <div class="flex text-sm text-muted-foreground md:flex-col lt-md:justify-between md:gap-2">
        <div class="flex flex-col gap-1">
          <span>{{ formatDate(photo.takenAt) }}</span>
          <span>{{ formatCameraText(photo) }}</span>
          <NuxtLinkLocale
            v-for="tag in photo.tags?.split(',') || []"
            :key="tag"
            :to="`/tag/${tag}`"
            class="m--1 w-fit rounded-lg p-1 transition-colors hover:bg-muted"
          >
            <Tag :label="tag" />
          </NuxtLinkLocale>
        </div>
        <div class="flex flex-col text-sm text-muted-foreground">
          <div class="flex gap-2">
            <span>{{ photo.focalLength ? toFixed(photo.focalLength, 1) : '--' }}mm</span>
            <span
              v-if="photo.focalLengthIn35mmFormat"
              :title="$t('camera_lens.focal_length_35mm')"
              class="op-50"
            >{{ photo.focalLengthIn35mmFormat }}mm</span>
          </div>
          <span
            v-for="meta, idx in formatExposure(photo)"
            :key="idx"
          >{{ meta }}</span>
          <span>{{ photo.exposureCompensation ? `${photo.exposureCompensation > 0 ? '+' : ''}${photo.exposureCompensation.toFixed(1)}ev` : '0ev' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
