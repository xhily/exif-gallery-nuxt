<script setup lang="ts">
const dropZoneRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const uploadingImg = ref(false)
const disconnect = ref(false)

const toast = useToast()
const { uploadImage, deleteImage, images } = useFile()
const { loggedIn, clear } = useUserSession()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

function openFilePicker() {
  fileInput.value?.click()
}

async function fileSelection(event: Event) {
  const target = event.target as HTMLInputElement

  if (target.files?.[0]) {
    await uploadFile(target.files[0])
  }
}

async function onDrop(files: File[] | null) {
  if (files) {
    await uploadFile(files[0] as File)
  }
}

async function uploadFile(file: File) {
  uploadingImg.value = true

  await uploadImage(file)
    .catch(() => toast.add({ title: 'An error occured', description: 'Please try again', color: 'red' }))
    .finally(() => uploadingImg.value = false)
}

async function deleteFile(pathname: string) {
  await deleteImage(pathname)
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
          v-if="images && images.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <li
            v-for="image in images"
            :key="image.pathname"
            class="relative group"
          >
            <img
              :src="`/images/${image.pathname}`"
              class="w-full h-48 object-cover rounded-md"
              alt=""
            >
            <UButton
              :loading="false"
              color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              @click="deleteFile(image.pathname)"
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
