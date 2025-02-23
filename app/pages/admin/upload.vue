<script setup lang="ts">
import pLimit from 'p-limit'

interface FileEntry {
  id: number
  file: File
  aiLoading?: boolean
  compressedFile?: compressFiles
  photo: IPhoto
}

let fileId = 0

const files = ref<FileEntry[]>([])
const uploadingImg = ref(false)

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

async function upload(fileEntry: FileEntry) {
  uploadingImg.value = true
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
    const response = await $fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.success) {
      toast.add({ title: `上传成功 ${fileEntry.photo.title || ''}`, description: fileEntry.file.name, color: 'green' })
    }
    else {
      toast.add({ title: '上传失败', description: '请重试', color: 'red' })
    }
  }
  catch (error: any) {
    toast.add({
      title: '上传失败',
      description: error.data?.message || error.message || '请重试',
      color: 'red',
    })
  }
  finally {
    uploadingImg.value = false
  }
}

const aiLimit = pLimit(1)
async function generate(fileEntry: FileEntry) {
  fileEntry.aiLoading = true
  setFile(fileEntry)
  const aiData = await aiLimit(() => getAiImageAnalysis(fileEntry.file))
  fileEntry.photo = { ...fileEntry.photo, ...aiData, tags: aiData.tags.join(',') }
  fileEntry.aiLoading = false
  setFile(fileEntry)
}

async function processFiles(rawFiles: File[]) {
  const fileEntries = rawFiles.map((file) => {
    const fileEntry: FileEntry = {
      id: fileId,
      file,
      photo: {},
    }
    fileId += 1
    return fileEntry
  })
  files.value.push(...fileEntries)

  const exifTasks = fileEntries.map(async (fileEntry) => {
    const photo = await getExifData(fileEntry.file)
    fileEntry.photo = { ...fileEntry.photo, ...photo }
    setFile(fileEntry)
  })
  await Promise.allSettled(exifTasks)
  if (uploadConfig.value.enableCompression) {
    const compressTasks = fileEntries.map(async (fileEntry) => {
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
    })
    Promise.allSettled(compressTasks)
  }
  if (aiConfig.value.enabled) {
    const aiTasks = fileEntries.map(generate)
    Promise.allSettled(aiTasks)
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
        :uploading="uploadingImg"
        type="submit"
        class="mb-6"
        :is-over-drop-zone="isOverDropZone"
        @click="openFilePicker"
      />
    </section>

    <div class="space-y-4">
      <UButton
        label="上传全部"
        @click="upload"
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
        @upload="upload(file)"
        @generate="generate(file)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
