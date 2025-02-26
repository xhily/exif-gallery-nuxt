<script setup lang="ts">
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

const props = defineProps<{
  id: number
  file: File
  compressFile?: compressFiles
  aiLoading?: boolean
  uploadLoading?: boolean
}>()

const emit = defineEmits<{
  upload: []
  generate: []
}>()

const { config: uploadConfig } = useUploadConfig()

const photo = defineModel<IPhoto>({ required: true })
const activeId = defineModel<number>('activeId')

const compressLoading = computed(() =>
  props.compressFile?.jpeg === 'loading'
  || props.compressFile?.webp === 'loading'
  || props.compressFile?.avif === 'loading'
  || props.compressFile?.thumbnail === 'loading',
)

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
  activeId.value = activeId.value === id ? undefined : id
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
    <UCard
      :ui="{
        background: 'hover:bg-gray-50',
      }"
    >
      <div class="flex justify-between gap-2 relative">
        <div class="absolute top-0 right-0 flex flex-col gap-2 items-end">
          <UButton
            color="gray"
            variant="solid"
            class="w-fit"
            label="上传"
            :disabled="aiLoading || compressLoading"
            :loading="uploadLoading"
            @click="emit('upload')"
          />
          <UButton
            color="gray"
            variant="solid"
            class="w-fit"
            label="AI识图"
            :loading="aiLoading"
            @click="emit('generate')"
          />
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap gap-2 items-center mr-10">
            <div class="font-medium text-lg mr-2">
              {{ file.name }}
            </div>
            <UBadge
              v-for="tag in photo.tags?.split(',') || []"
              :key="tag"
              :label="tag"
              color="gray"
            />
          </div>
          <div class="flex flex-wrap gap-4 items-center mr-10">
            <div class="text-lg">
              {{ photo.title || '未命名' }}
            </div>
            <div class="">
              {{ photo.caption }}
            </div>
          </div>
          <div class="flex flex-wrap gap-6 items-start flex-1">
            <div ref="viewerRef" class="flex gap-4">
              <UploadPhotoImage type="original" :file="file" />
              <UploadPhotoImage v-if="uploadConfig.formats.jpeg" type="JPEG" :file="compressFile?.jpeg" />
              <UploadPhotoImage v-if="uploadConfig.formats.webp" type="WebP" :file="compressFile?.webp" />
              <UploadPhotoImage v-if="uploadConfig.formats.avif" type="AVIF" :file="compressFile?.avif" />
              <UploadPhotoImage v-if="uploadConfig.formats.thumbnail" type="thumbnail" :file="compressFile?.thumbnail" />
            </div>

            <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
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
          :icon="activeId === id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          @click="toggleItem(id)"
        />
      </div>
      <div v-if="activeId === id">
        <UploadPhotoForm v-model="photo" />
      </div>
    </UCard>
  </div>
</template>
