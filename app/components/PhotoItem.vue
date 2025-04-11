<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const {
  mini,
} = defineProps<{
  loggedIn?: boolean
  imageClass?: HTMLAttributes['class']
  hideAction?: boolean
  mini?: boolean
  editable?: boolean
}>()

const emit = defineEmits<{
  deleted: [id: string]
  update: [photo: IPhoto]
}>()

const photo = defineModel<IPhoto>('photo', { required: true })
const photoWithExif = computed(() => photo.value.make || photo.value.model || photo.value.focalLength || photo.value.focalLengthIn35mmFormat || photo.value.fNumber || photo.value.exposureTime || photo.value.iso || photo.value.exposureCompensation)

const isMini = computed(() => mdScreen.value && mini)

const { deletingPhoto, deletePhoto: _deletePhoto } = useDeletePhoto()
function deletePhoto(id: string) {
  _deletePhoto(id).then(() => emit('deleted', id))
}
</script>

<template>
  <div class="flex gap-1 lt-md:flex-col lg:gap-8 md:gap-4">
    <div v-if="isMini" class="relative md:flex-[2] xl:flex-[3]">
      <PhotoItemCard class="absolute inset-0 h-full w-full" :photo="photo" :image-class="imageClass" mini />
    </div>
    <PhotoItemCard v-else :photo="photo" class="md:flex-[2] xl:flex-[3]" :image-class="imageClass" />
    <div class="relative sticky top-16 z-1 h-fit md:flex-[1]">
      <div class="flex lt-md:mb-2 md:flex-col lt-md:justify-between">
        <div>
          <h3> {{ photo.title }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ photo.caption }}
          </p>
        </div>
        <div v-if="!hideAction" class="ml--2.4 min-h-2 flex items-center">
          <slot name="action-button" />
          <EditPhotoDialog
            v-if="editable"
            :photo="photo"
          >
            <TooltipIconButton
              v-if="loggedIn"
              :label="$t('button.edit')"
              icon="i-lucide-edit text-muted-foreground"
            />
          </EditPhotoDialog>
          <TooltipIconButton
            v-if="loggedIn"
            :loading="deletingPhoto === photo.id"
            :label="$t('button.delete')"
            icon="i-lucide-trash text-muted-foreground"
            @click="deletePhoto(photo.id)"
          />
        </div>
      </div>

      <div class="flex text-sm text-muted-foreground md:flex-col lt-md:justify-between md:gap-2">
        <div class="flex flex-col gap-1">
          <span>{{ formatDate(photo.takenAt) }}</span>
          <span v-if="photoWithExif">{{ formatCameraText(photo) }}</span>
          <NuxtLinkLocale
            v-for="tag in photo.tags?.split(',') || []"
            :key="tag"
            :to="`/tag/${tag}`"
            class="m--1 w-fit rounded-lg p-1 transition-colors hover:bg-muted"
          >
            <Tag :label="tag" />
          </NuxtLinkLocale>
        </div>
        <div
          v-if="photoWithExif"
          class="flex flex-col text-sm text-muted-foreground font-mono"
        >
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
