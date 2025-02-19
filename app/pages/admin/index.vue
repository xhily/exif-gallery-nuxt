<script setup lang="ts">
const router = useRouter()

const dropZoneRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const uploadingImg = ref(false)
const disconnect = ref(false)

const toast = useToast()
const { photos } = usePhotos()
const { loggedIn, clear } = useUserSession()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

function openFilePicker() {
  fileInput.value?.click()
}

async function fileSelection(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    await uploadFiles(Array.from(target.files))
  }
}

async function onDrop(files: File[] | null) {
  if (files?.length) {
    await uploadFiles(files)
  }
}

async function uploadFiles(files: File[]) {
  uploadingImg.value = true

  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`file[${index}]`, file)
    formData.append(`lastModified[${index}]`, file.lastModified.toString())
  })

  try {
    const response = await $fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.success) {
      router.push('/admin/uploading')
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

async function deleteFile(pathname: string) {
  await $fetch(`/api/photos/${pathname}`, { method: 'DELETE' })
    .catch(() => toast.add({ title: 'An error occured', description: 'Please try again', color: 'red' }))
}

async function clearSession() {
  disconnect.value = true
  await clear().finally(() => disconnect.value = false)
}
</script>

<template>
  <div>
    <section
      v-if="loggedIn"
      ref="dropZoneRef"
      class="relative min-h-screen p-4"
    >
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-white">
          Admin Panel
        </h1>
        <UButton
          :loading="disconnect"
          icon="i-heroicons-power-20-solid"
          color="red"
          variant="ghost"
          @click="clearSession"
        />
      </div>

      <div class="w-full">
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

        <ul
          v-if="photos && photos.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <li
            v-for="photo in photos"
            :key="photo.pathname"
            class="relative group"
          >
            <img
              :src="`/photos/${photo.pathname}`"
              class="w-full h-48 object-cover rounded-md"
              alt=""
            >
            <UButton
              :loading="false"
              color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              @click="deleteFile(photo.pathname)"
            />
          </li>
        </ul>
      </div>
    </section>
    <div
      v-else
      class="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 class="text-2xl font-bold text-white mb-4">
        Admin Access Required
      </h1>
      <NuxtLink
        to="/"
        class="text-blue-500 hover:text-blue-400"
      >
        Return to Gallery
      </NuxtLink>
    </div>
  </div>
</template>
