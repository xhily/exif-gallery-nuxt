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

const isOpen = computed({
  get: () => activeId.value === props.id,
  set: value => value ? activeId.value = props.id : activeId.value = undefined,
})

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
  <Card class="relative p4">
    <Collapsible v-model:open="isOpen" class="space-y-4">
      <div class="flex lt-md:flex-col justify-between gap-2">
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="mr-2">{{ file.name }}</span>
            <Badge
              v-for="tag in photo.tags?.split(',') || []"
              :key="tag"
              variant="secondary"
              class="rounded-lg"
            >
              <span>{{ tag }}</span>
            </Badge>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-lg font-medium">{{ photo.title || '未命名' }}</span>
            <span class="text-sm text-muted-foreground">{{ photo.caption }}</span>
          </div>
          <div class="flex flex-1 flex-wrap items-start gap-6">
            <div ref="viewerRef" class="flex gap-4 flex-wrap">
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
        <div class="flex md:flex-col items-end justify-center gap-2">
          <Button
            variant="outline"
            class="w-fit"
            :disabled="aiLoading || compressLoading"
            :loading="uploadLoading"
            @click="emit('upload')"
          >
            <span>上传</span>
          </Button>
          <Button
            variant="outline"
            class="w-fit"
            :loading="aiLoading"
            @click="emit('generate')"
          >
            <span>AI识图</span>
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <Card class="p4">
          <UploadPhotoForm v-model="photo" />
        </Card>
      </CollapsibleContent>
    </Collapsible>
    <Button
      variant="outline"
      class="absolute bottom-0 left-50% h-6 w-12 translate-x--50% translate-y-50% p-0"
      @click="isOpen = !isOpen"
    >
      <div :class="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
    </Button>
  </Card>
</template>
