<script setup lang="ts">
const photo = defineModel<IPhoto>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Basic Information -->
    <div>
      <h3 class="text-lg font-medium">
        基本信息
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-4 md:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">标题</Label>
          <Input v-model="photo.title" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">描述</Label>
          <Input v-model="photo.caption" class="h-8 py-1" />
        </div>
        <div class="lg:col-span-2">
          <Label class="text-sm font-medium">标签</Label>
          <TagsInputString v-model="photo.tags" class="py-1">
            <TagsInputItem v-for="tag in photo.tags?.split(',') || []" :key="tag" :value="tag">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="添加标签..." />
          </TagsInputString>
        </div>
        <div class="lg:col-span-4">
          <Label class="text-sm font-medium">语义描述</Label>
          <Textarea v-model="photo.semanticDescription" class="min-h-12 py-1" />
        </div>
      </div>
    </div>

    <!-- Camera and Lens -->
    <div>
      <h3 class="text-lg font-medium">
        相机镜头
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 md:grid-cols-4 sm:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">相机品牌</Label>
          <Input v-model="photo.make" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">相机型号</Label>
          <Input v-model="photo.model" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">镜头品牌</Label>
          <Input v-model="photo.lensMake" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">镜头型号</Label>
          <Input v-model="photo.lensModel" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">焦距</Label>
          <Input v-model.number="photo.focalLength" type="number" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">等效35mm焦距</Label>
          <Input v-model.number="photo.focalLengthIn35mmFormat" type="number" class="h-8 py-1" />
        </div>
      </div>
    </div>

    <!-- Exposure Settings -->
    <div>
      <h3 class="text-lg font-medium">
        曝光设置
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-4 md:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">光圈</Label>
          <Input v-model.number="photo.fNumber" type="number" step="0.1" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">ISO</Label>
          <Input v-model.number="photo.iso" type="number" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">快门速度</Label>
          <Input v-model.number="photo.exposureTime" type="number" step="0.001" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">曝光补偿</Label>
          <Input v-model.number="photo.exposureCompensation" type="number" step="0.1" class="h-8 py-1" />
        </div>
      </div>
    </div>

    <!-- Location Information -->
    <div>
      <h3 class="text-lg font-medium">
        位置信息
      </h3>
      <div class="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-4 md:grid-cols-2">
        <div>
          <Label class="text-sm font-medium">地点名称</Label>
          <Input v-model="photo.locationName" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">纬度</Label>
          <Input v-model.number="photo.latitude" type="number" step="0.000001" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">经度</Label>
          <Input v-model.number="photo.longitude" type="number" step="0.000001" class="h-8 py-1" />
        </div>
        <div>
          <Label class="text-sm font-medium">拍摄时间</Label>
          <InputDatetime v-model="photo.takenAt" class="h-8 py-1" />
        </div>
      </div>
    </div>
  </div>
</template>
