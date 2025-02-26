<script setup lang="ts">
import pLimit from 'p-limit'

definePageMeta({
  layout: 'admin',
})

interface FileEntry {
  id: number
  file: File
  aiLoading?: boolean
  uploadLoading?: boolean
  compressedFile?: compressFiles
  photo: IPhoto
}

let fileId = 0

const files = ref<FileEntry[]>([])
const compressLoading = ref(false)
const aiLoading = ref(false)
const uploadLoading = ref(false)

const { config: uploadConfig } = useUploadConfig()
const { config: aiConfig } = useAIConfig()

const toast = useToast()

const dropZoneRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
function onDrop(files: File[] | null) {
  if (files?.length) {
    processFiles(files)
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

function openFilePicker() {
  fileInput.value?.click()
}

async function fileSelection(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    await processFiles(Array.from(target.files))
  }
}

function setFile(fileEntry: FileEntry) {
  const index = files.value.findIndex(f => f.id === fileEntry.id)
  if (index !== -1) {
    files.value[index] = { ...fileEntry }
  }
}

const uploadLimit = pLimit(4)
async function upload(fileEntry: FileEntry) {
  fileEntry.uploadLoading = true
  setFile(fileEntry)
  const formData = new FormData()
  if (
    fileEntry.compressedFile?.jpeg instanceof File
    || fileEntry.compressedFile?.webp instanceof File
    || fileEntry.compressedFile?.avif instanceof File
  ) {
    Object.entries(fileEntry.compressedFile || {}).forEach(([type, compressedFile]) => {
      if (compressedFile) {
        formData.append(type, compressedFile)
      }
    })
  }
  else {
    // thumbnail only
    if (fileEntry.compressedFile?.thumbnail instanceof File) {
      formData.append('thumbnail', fileEntry.compressedFile.thumbnail)
    }
    // original file
    if (fileEntry.file.type === 'image/webp')
      formData.append('webp', fileEntry.file)
    else if (fileEntry.file.type === 'image/avif')
      formData.append('avif', fileEntry.file)
    else
      formData.append('jpeg', fileEntry.file)
  }
  formData.append('fileModified', fileEntry.file.lastModified.toString())
  Object.entries(fileEntry.photo).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString())
    }
    else if (typeof value === 'number' || typeof value === 'boolean') {
      formData.append(key, value.toString())
    }
    else if (value != null) {
      formData.append(key, value)
    }
  })

  try {
    const response = await uploadLimit(() => $fetch<{
      success: boolean
    }>('/api/photos/upload', {
      method: 'POST',
      body: formData,
    }))

    if (response.success) {
      toast.add({ title: `上传成功 ${fileEntry.photo.title || ''}`, description: fileEntry.file.name, color: 'green' })
      const index = files.value.findIndex(f => f.id === fileEntry.id)
      if (index !== -1) {
        files.value.splice(index, 1)
      }
    }
    else {
      toast.add({ title: '上传失败', description: '请重试', color: 'red' })
      fileEntry.uploadLoading = false
      setFile(fileEntry)
    }
  }
  catch (error: any) {
    toast.add({
      title: '上传失败',
      description: error.data?.message || error.message || '请重试',
      color: 'red',
    })
    fileEntry.uploadLoading = false
    setFile(fileEntry)
  }
}

async function uploadAll() {
  const uploadTask = files.value.map(upload)
  uploadLoading.value = true
  await Promise.allSettled(uploadTask).finally(() => {
    uploadLoading.value = false
  })
}

async function processFileExif(fileEntry: FileEntry) {
  const photo = await getExifData(fileEntry.file)
  fileEntry.photo = { ...fileEntry.photo, ...photo }
  setFile(fileEntry)
}

async function processFileCompress(fileEntry: FileEntry) {
  const fileType = fileEntry.file.type
  const formatsConfig = { ...toRaw(uploadConfig.value).formats }
  if (fileType === 'webp') {
    formatsConfig.jpeg = false
    formatsConfig.webp = false
  }
  if (fileType === 'avif') {
    formatsConfig.jpeg = false
    formatsConfig.webp = false
    formatsConfig.avif = false
  }
  fileEntry.compressedFile = Object.fromEntries(Object.entries(formatsConfig).map(
    ([type, value]) => [type, value ? 'loading' : undefined],
  ))
  setFile(fileEntry)
  await compressImageMultiResult(
    fileEntry.file,
    formatsConfig,
    (type, file) => {
      fileEntry.compressedFile = {
        ...fileEntry.compressedFile,
        [type]: file,
      }
      setFile(fileEntry)
    },
  )
}

const aiLimit = pLimit(1)
async function processFileAiDescription(fileEntry: FileEntry) {
  fileEntry.aiLoading = true
  setFile(fileEntry)
  try {
    const aiData = await aiLimit(() => getAiImageAnalysis(fileEntry.file))
    fileEntry.photo = { ...fileEntry.photo, ...aiData, tags: aiData.tags.join(',') }
  }
  catch (error) {
    console.error('Failed to get AI description', error)
  }
  finally {
    fileEntry.aiLoading = false
    setFile(fileEntry)
  }
}

async function processFiles(rawFiles: File[]) {
  const fileEntries: FileEntry[] = rawFiles.map((file, index) => ({
    id: fileId + index,
    file,
    photo: {},
  }))
  files.value.push(...fileEntries)
  fileId += rawFiles.length
  const exifTasks = fileEntries.map(processFileExif)
  Promise.allSettled(exifTasks)
  if (uploadConfig.value.enableCompression) {
    const compressTasks = fileEntries.map(processFileCompress)
    compressLoading.value = true
    Promise.allSettled(compressTasks).finally(() => {
      compressLoading.value = false
    })
  }
  if (aiConfig.value.enabled) {
    const aiTasks = fileEntries.map(processFileAiDescription)
    aiLoading.value = true
    Promise.allSettled(aiTasks).finally(() => {
      aiLoading.value = false
    })
  }
}

const activeId = ref<number>()
</script>

<template>
  <div class="container mx-auto p-4">
    <UploadConfig :disabled="files.length > 0" />

    <section
      ref="dropZoneRef"
      class="relative p-4"
    >
      <input
        ref="fileInput"
        class="hidden"
        type="file"
        accept="image/*"
        multiple
        @change="fileSelection"
      >
      <UploadButton
        type="submit"
        class="mb-6"
        :is-over-drop-zone="isOverDropZone"
        @click="openFilePicker"
      />
    </section>

    <div class="space-y-4">
      <UButton
        v-if="files.length"
        color="gray"
        variant="solid"
        label="上传全部"
        :disabled="aiLoading || compressLoading"
        :loading="uploadLoading"
        @click="uploadAll()"
      />
      <UploadPhoto
        v-for="file in files"
        :id="file.id"
        :key="file.id"
        v-model:active-id="activeId"
        v-model="file.photo"
        :file="file.file"
        :compress-file="file.compressedFile"
        :ai-loading="file.aiLoading"
        :upload-loading="file.uploadLoading"
        @upload="upload(file)"
        @generate="processFileAiDescription(file)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
