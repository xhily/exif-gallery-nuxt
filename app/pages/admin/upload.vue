<script setup lang="ts">
import pLimit from 'p-limit'

interface FileEntry {
  id: number
  file: File
  compressedFile?: compressFiles
  photo: IPhoto
}

let fileId = 0

const files = ref<FileEntry[]>([])
const uploadingImg = ref(false)

const { config: uploadConfig } = useUploadConfig()
const { config: aiConfig } = useAIConfig()

function setFile(fileEntry: FileEntry) {
  const index = files.value.findIndex(f => f.id === fileEntry.id)
  if (index !== -1) {
    files.value[index] = { ...fileEntry }
  }
}

async function processFiles(rawFiles: File[]) {
  const fileEntries = rawFiles.map((file) => {
    const fileEntry: FileEntry = {
      id: fileId,
      file,
      photo: {
        fileName: file.name,
        fileExtension: file.name.split('.').pop() || '',
        fileSize: file.size,
        fileModified: new Date(file.lastModified) || Date.now(),
      },
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
    const compressLimit = pLimit(4)
    const compressTasks = fileEntries.map(fileEntry => compressLimit(async () => {
      const compressedFile = await compressImage(fileEntry.file, {
        // FIXME
        // formats: uploadConfig.value.formats,
      })
      fileEntry.compressedFile = compressedFile
      setFile(fileEntry)
    }))
    Promise.allSettled(compressTasks)
  }

  if (aiConfig.value.enabled) {
    const aiLimit = pLimit(1)
    const aiTasks = fileEntries.map(fileEntry => aiLimit(async () => {
    // TODO AI特征提取
      console.warn('AI特征提取:', fileEntry)
    }))
    Promise.allSettled(aiTasks)
  }
}

function upload(file: FileEntry) {
  // TODO upload
  console.warn('保存元数据:', file)
  // 这里可以添加API调用
}

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
      <UploadPhoto
        v-for="file in files"
        :id="file.id"
        :key="file.id"
        v-model="file.photo"
        :file="file.file"
        :compress-file="file.compressedFile"
        @update="upload"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
