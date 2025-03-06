<script setup lang="ts">
const photo = defineModel<IPhoto>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Basic Information -->
    <div>
      <h3 class="text-lg font-medium">
        {{ $t('basic_info.title') }}
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-4 md:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">{{ $t('basic_info.photo_title') }}</Label>
          <Input v-model="photo.title" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('basic_info.description') }}</Label>
          <Input v-model="photo.caption" class="h-8 py-1" />
        </div>
        <div class="lg:col-span-2">
          <Label class="text-sm font-medium">{{ $t('basic_info.tags') }}</Label>
          <TagsInputString v-model="photo.tags" class="py-1">
            <TagsInputItem v-for="tag in photo.tags?.split(',') || []" :key="tag" :value="tag">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput :placeholder="$t('basic_info.tags_placeholder')" />
          </TagsInputString>
        </div>
        <div class="lg:col-span-4">
          <Label class="text-sm font-medium">{{ $t('basic_info.semantic_description') }}</Label>
          <Textarea v-model="photo.semanticDescription" class="min-h-12 py-1" />
        </div>
      </div>
    </div>

    <!-- Camera and Lens -->
    <div>
      <h3 class="text-lg font-medium">
        {{ $t('camera_lens.title') }}
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 md:grid-cols-4 sm:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">{{ $t('camera_lens.camera_make') }}</Label>
          <Input v-model="photo.make" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('camera_lens.camera_model') }}</Label>
          <Input v-model="photo.model" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('camera_lens.lens_make') }}</Label>
          <Input v-model="photo.lensMake" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('camera_lens.lens_model') }}</Label>
          <Input v-model="photo.lensModel" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('camera_lens.focal_length') }}</Label>
          <Input v-model.number="photo.focalLength" type="number" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('camera_lens.focal_length_35mm') }}</Label>
          <Input v-model.number="photo.focalLengthIn35mmFormat" type="number" class="h-8 py-1" />
        </div>
      </div>
    </div>

    <!-- Exposure Settings -->
    <div>
      <h3 class="text-lg font-medium">
        {{ $t('exposure.title') }}
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-4 md:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">{{ $t('exposure.aperture') }}</Label>
          <Input v-model.number="photo.fNumber" type="number" step="0.1" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('exposure.iso') }}</Label>
          <Input v-model.number="photo.iso" type="number" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('exposure.shutter_speed') }}</Label>
          <Input v-model.number="photo.exposureTime" type="number" step="0.001" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('exposure.exposure_compensation') }}</Label>
          <Input v-model.number="photo.exposureCompensation" type="number" step="0.1" class="h-8 py-1" />
        </div>
      </div>
    </div>

    <!-- Location Information -->
    <div>
      <h3 class="text-lg font-medium">
        {{ $t('location.title') }}
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-4 md:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">{{ $t('location.location_name') }}</Label>
          <Input v-model="photo.locationName" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('location.latitude') }}</Label>
          <Input v-model.number="photo.latitude" type="number" step="0.000001" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('location.longitude') }}</Label>
          <Input v-model.number="photo.longitude" type="number" step="0.000001" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">{{ $t('location.taken_at') }}</Label>
          <InputDatetime v-model="photo.takenAt" class="h-8 py-1" />
        </div>
      </div>
    </div>
  </div>
</template>
