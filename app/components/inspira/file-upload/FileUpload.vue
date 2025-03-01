<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Motion } from 'motion-v'
import { cn } from '~/lib/utils'

interface FileUploadProps {
  class?: HTMLAttributes['class']
}

defineProps<FileUploadProps>()

const emit = defineEmits<{
  (e: 'onChange', files: File[]): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const isActive = ref<boolean>(false)

function handleFileChange(newFiles: File[]) {
  files.value = [...files.value, ...newFiles]
  emit('onChange', files.value)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files)
    return
  handleFileChange(Array.from(input.files))
}

function handleClick() {
  fileInputRef.value?.click()
}

function handleEnter() {
  isActive.value = true
}
function handleLeave() {
  isActive.value = false
}
function handleDrop(e: DragEvent) {
  isActive.value = false
  const droppedFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
  if (droppedFiles.length)
    handleFileChange(droppedFiles)
}
</script>

<template>
  <ClientOnly>
    <div
      :class="cn('w-full', $props.class)"
      @dragover.prevent="handleEnter"
      @dragleave="handleLeave"
      @drop.prevent="handleDrop"
      @mouseover="handleEnter"
      @mouseleave="handleLeave"
    >
      <div
        class="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
        @click="handleClick"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          @change="onFileChange"
        >

        <!-- Grid pattern -->
        <div
          class="[mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none absolute inset-0"
        >
          <slot />
        </div>

        <!-- Content -->
        <div class="flex flex-col items-center justify-center">
          <p
            class="relative z-20 text-base text-neutral-700 font-bold font-sans dark:text-neutral-300"
          >
            Upload file
          </p>
          <p
            class="relative z-20 mt-2 text-base text-neutral-400 font-normal font-sans dark:text-neutral-400"
          >
            Drag or drop your files here or click to upload
          </p>

          <div class="relative mx-auto mt-10 max-w-xl w-full space-y-4">
            <Motion
              v-for="(file, idx) in files"
              :key="`file-${idx}`"
              :initial="{ opacity: 0, scaleX: 0 }"
              :animate="{ opacity: 1, scaleX: 1 }"
              class="relative z-40 mx-auto w-full flex flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 shadow-sm md:h-24 dark:bg-neutral-900"
            >
              <div class="w-full flex items-center justify-between gap-4">
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                >
                  {{ file.name }}
                </Motion>
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white"
                >
                  {{ (file.size / (1024 * 1024)).toFixed(2) }} MB
                </Motion>
              </div>

              <div
                class="mt-2 w-full flex flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400"
              >
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="rounded-md bg-gray-100 px-1.5 py-1 text-sm dark:bg-neutral-800"
                >
                  {{ file.type || "unknown type" }}
                </Motion>
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                >
                  modified {{ new Date(file.lastModified).toLocaleDateString() }}
                </Motion>
              </div>
            </Motion>

            <template v-if="!files.length">
              <Motion
                as="div"
                class="relative z-40 mx-auto mt-4 h-32 max-w-32 w-full flex items-center justify-center rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] dark:bg-neutral-900 group-hover/file:shadow-2xl"
                :initial="{
                  x: 0,
                  y: 0,
                  opacity: 1,
                }"
                :transition="{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }"
                :animate="
                  isActive
                    ? {
                      x: 20,
                      y: -20,
                      opacity: 0.9,
                    }
                    : {}
                "
              >
                <Icon
                  name="heroicons:arrow-up-tray-20-solid"
                  class="text-neutral-600 dark:text-neutral-400"
                  size="20"
                />
              </Motion>

              <div
                class="absolute inset-0 z-30 mx-auto mt-4 h-32 max-w-32 w-full flex items-center justify-center border border-sky-400 rounded-md border-dashed bg-transparent transition-opacity"
                :class="{ 'opacity-100': isActive, 'opacity-0': !isActive }"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.group-hover\/file\:shadow-2xl:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
</style>
