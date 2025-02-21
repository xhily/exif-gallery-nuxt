<script setup lang="ts">
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

const props = defineProps<{
  id: number
  file: File
  compressFile?: compressFiles
}>()

const emit = defineEmits(['update'])

const photo = defineModel<IPhoto>({ required: true })

const activeItemId = ref<number>()

let viewer: Viewer | undefined
const viewerRef = ref<HTMLElement>()

onMounted(() => {
  if (!viewerRef.value)
    return
  viewer = new Viewer(viewerRef.value, {
    transition: false,
    toolbar: {
      prev: 1,
      zoomIn: 1,
      oneToOne: 1,
      reset: 1,
      zoomOut: 1,
      next: 1,
    },
  })
})

function formatExposure(meta: IPhoto): string {
  return `ƒ/${meta.fNumber} • ${meta.exposureTime}s • ISO ${meta.iso}`
}

function formatDate(timestamp?: number | Date | null): string {
  if (!timestamp)
    return ''
  return new Date(timestamp).toLocaleDateString()
}

function toggleItem(id: number) {
  activeItemId.value = activeItemId.value === id ? undefined : id
}

function handleSubmit(item: IPhoto) {
  emit('update', item)
  activeItemId.value = undefined
}

watch(() => [props.file, props.compressFile], async () => {
  await nextTick()
  if (viewer)
    viewer.update()
})

onUnmounted(() => {
  if (viewer)
    viewer.destroy()
})
</script>

<template>
  <div class="w-full">
    <div
      class="w-full"
      :class="{ 'mb-4': activeItemId === id }"
    >
      <UCard
        :ui="{
          background: 'hover:bg-gray-50',
          body: { base: 'flex justify-between items-center' },
        }"
      >
        <div class="flex flex-col gap-4">
          <div class="font-medium text-lg mb-2">
            {{ file.name }}
          </div>
          <div class="flex flex-wrap gap-6 items-start flex-1">
            <div ref="viewerRef" class="flex gap-4">
              <UploadPhotoImage type="original" :file="file" />
              <UploadPhotoImage type="JPEG" :file="compressFile?.jpeg" />
              <UploadPhotoImage type="WebP" :file="compressFile?.webp" />
              <UploadPhotoImage type="AVIF" :file="compressFile?.avif" />
              <UploadPhotoImage type="thumbnail" :file="compressFile?.thumbnail" />
            </div>

            <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
              <div class="text-lg">
                {{ photo.title || '未命名' }}
              </div>
              <div class="text-sm text-gray-600">
                {{ photo.make }} {{ photo.model }}
              </div>
              <div class="text-sm text-gray-600">
                {{ formatExposure(photo) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ formatDate(photo.takenAt) }}
              </div>
            </div>
          </div>
        </div>
        <UButton
          color="gray"
          variant="ghost"
          class="self-center"
          :icon="activeItemId === id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          @click="toggleItem(id)"
        />
      </UCard>
    </div>

    <div v-if="activeItemId === id">
      <UploadPhotoForm
        v-model="photo"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
