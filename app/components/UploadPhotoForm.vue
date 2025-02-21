<script setup lang="ts">
const emit = defineEmits(['submit'])

const photo = defineModel<IPhoto>({ required: true })

function handleSubmit(item: IPhoto) {
  emit('submit', item)
}
</script>

<template>
  <UForm
    :state="photo"
    class="p-4 space-y-4 rounded-lg shadow"
    @submit="handleSubmit(photo)"
  >
    <div class="space-y-6">
      <!-- Basic Information -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        基本信息
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UFormGroup label="标题" name="title">
          <UInput v-model="photo.title" />
        </UFormGroup>
        <UFormGroup label="描述" name="caption">
          <UInput v-model="photo.caption" />
        </UFormGroup>
        <UFormGroup label="标签" name="tags" class="lg:col-span-2">
          <TagsInput v-model="photo.tags" />
        </UFormGroup>
        <UFormGroup label="语义描述" name="semanticDescription" class="lg:col-span-4">
          <UTextarea v-model="photo.semanticDescription" autoresize />
        </UFormGroup>
      </div>

      <!-- Camera Information -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        相机信息
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UFormGroup label="相机品牌" name="make">
          <UInput v-model="photo.make" />
        </UFormGroup>
        <UFormGroup label="相机型号" name="model">
          <UInput v-model="photo.model" />
        </UFormGroup>
      </div>

      <!-- Lens Information -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        镜头信息
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UFormGroup label="镜头品牌" name="lensMake">
          <UInput v-model="photo.lensMake" />
        </UFormGroup>
        <UFormGroup label="镜头型号" name="lensModel">
          <UInput v-model="photo.lensModel" />
        </UFormGroup>
        <UFormGroup label="焦距" name="focalLength">
          <UInput
            v-model.number="photo.focalLength"
            type="number"
          />
        </UFormGroup>
        <UFormGroup label="等效35mm焦距" name="focalLengthIn35mmFormat">
          <UInput
            v-model.number="photo.focalLengthIn35mmFormat"
            type="number"
          />
        </UFormGroup>
      </div>

      <!-- Exposure Settings -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        曝光设置
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <UFormGroup label="快门速度" name="exposureTime">
          <UInput
            v-model.number="photo.exposureTime"
            type="number"
            step="0.001"
          />
        </UFormGroup>
        <UFormGroup label="曝光补偿" name="exposureCompensation">
          <UInput
            v-model.number="photo.exposureCompensation"
            type="number"
            step="0.1"
          />
        </UFormGroup>
      </div>

      <!-- Location Information -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        位置信息
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UFormGroup label="地点名称" name="locationName">
          <UInput v-model="photo.locationName" />
        </UFormGroup>
        <UFormGroup label="纬度" name="latitude">
          <UInput
            v-model.number="photo.latitude"
            type="number"
            step="0.000001"
          />
        </UFormGroup>
        <UFormGroup label="经度" name="longitude">
          <UInput
            v-model.number="photo.longitude"
            type="number"
            step="0.000001"
          />
        </UFormGroup>
        <UFormGroup label="拍摄时间" name="takenAt">
          <DatePickerButton v-model="photo.takenAt" mode="datetime" />
        </UFormGroup>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <UButton type="submit">
        保存
      </UButton>
    </div>
  </UForm>
</template>
