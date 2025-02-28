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
    <Card>
      <div class="relative flex justify-between gap-2">
        <div class="absolute right-0 top-0 flex flex-col items-end gap-2">
          <Button
            class="w-fit"
            :disabled="aiLoading || compressLoading"
            :loading="uploadLoading"
            @click="emit('upload')"
          >
            <span>上传</span>
          </Button>
          <Button
            class="w-fit"
            :loading="aiLoading"
            @click="emit('generate')"
          >
            <span>AI识图</span>
          </Button>
        </div>
        <div class="flex flex-col gap-4">
          <div class="mr-10 flex flex-wrap items-center gap-2">
            <div class="mr-2 text-lg font-medium">
              {{ file.name }}
            </div>
            <Badge
              v-for="tag in photo.tags?.split(',') || []"
              :key="tag"
            >
              <span>{{ tag }}</span>
            </Badge>
          </div>
          <div class="mr-10 flex flex-wrap items-center gap-4">
            <div class="text-lg">
              {{ photo.title || '未命名' }}
            </div>
            <div class="">
              {{ photo.caption }}
            </div>
          </div>
          <div class="flex flex-1 flex-wrap items-start gap-6">
            <div ref="viewerRef" class="flex gap-4">
              <UploadPhotoImage type="original" :file="file" />
              <UploadPhotoImage v-if="uploadConfig.formats.jpeg" type="JPEG" :file="compressFile?.jpeg" />
              <UploadPhotoImage v-if="uploadConfig.formats.webp" type="WebP" :file="compressFile?.webp" />
              <UploadPhotoImage v-if="uploadConfig.formats.avif" type="AVIF" :file="compressFile?.avif" />
              <UploadPhotoImage v-if="uploadConfig.formats.thumbnail" type="thumbnail" :file="compressFile?.thumbnail" />
            </div>

            <div class="min-w-[200px] flex flex-1 flex-col gap-2">
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
        <Button
          variant="ghost"
          class="self-center"
          @click="toggleItem(id)"
        >
          <div :class="activeId === id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
        </Button>
      </div>
      <div v-if="activeId === id">
        <UploadPhotoForm v-model="photo" />
      </div>
    </Card>
  </div>
</template>
