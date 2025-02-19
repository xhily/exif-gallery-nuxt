<script setup lang="ts">
defineProps<{
  id: number
  file: File
}>()

const emit = defineEmits(['update'])

const photo = defineModel<IPhoto>({ required: true })

const activeItemId = ref<number | null>(null)

function formatExposure(meta: IPhoto): string {
  return `ƒ/${meta.fNumber} • ${meta.exposureTime}s • ISO ${meta.iso}`
}

function formatDate(timestamp?: number | Date | null): string {
  if (!timestamp)
    return ''
  return new Date(timestamp).toLocaleDateString()
}

function getBlobUrl(file: File): string {
  return URL.createObjectURL(file)
}

function toggleItem(id: number) {
  activeItemId.value = activeItemId.value === id ? null : id
}

function handleSubmit(item: IPhoto) {
  emit('update', item)
  activeItemId.value = null
}
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
            <div class="flex gap-4">
              <div class="flex flex-col items-center gap-1">
                <img
                  :src="getBlobUrl(file)"
                  :alt="file.name"
                  class="w-24 h-24 object-cover rounded"
                >
                <span class="text-xs text-gray-500">Original</span>
                <span class="text-xs text-gray-500">{{ (file.size / 1024).toFixed(1) }}KB</span>
              </div>
              <!-- WebP and AVIF previews will be added when compression is implemented -->
              <div class="flex flex-col items-center gap-1 opacity-50">
                <div class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                  <span class="text-sm text-gray-400">WebP</span>
                </div>
                <span class="text-xs text-gray-500">WebP</span>
                <span class="text-xs text-gray-500">-</span>
              </div>
              <div class="flex flex-col items-center gap-1 opacity-50">
                <div class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                  <span class="text-sm text-gray-400">AVIF</span>
                </div>
                <span class="text-xs text-gray-500">AVIF</span>
                <span class="text-xs text-gray-500">-</span>
              </div>
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
      {{ photo }}
      <UForm
        :state="photo"
        class="p-4 space-y-4 rounded-lg shadow"
        @submit="handleSubmit(photo)"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="标题" name="title">
            <UInput v-model="photo.title" />
          </UFormGroup>

          <UFormGroup label="拍摄时间" name="takenAt">
            <DatePickerButton v-model="photo.takenAt" mode="datetime" />
          </UFormGroup>

          <UFormGroup label="相机型号" name="model">
            <UInput v-model="photo.model" />
          </UFormGroup>

          <UFormGroup label="焦距" name="focalLength">
            <UInput
              v-model.number="photo.focalLength"
              type="number"
            />
          </UFormGroup>

          <UFormGroup label="光圈" name="fNumber">
            <UInput
              v-model.number="photo.fNumber"
              type="number"
              step="0.1"
            />
          </UFormGroup>

          <UFormGroup label="ISO" name="iso">
            <UInput
              v-model.number="photo.iso"
              type="number"
            />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-2">
          <UButton type="submit">
            保存
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>
