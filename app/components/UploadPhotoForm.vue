<script setup lang="ts">
const photo = defineModel<IPhoto>({ required: true })
</script>

<template>
  <Form :state="photo" class="rounded-lg p-4 shadow space-y-4">
    <div class="space-y-6">
      <!-- Basic Information -->
      <h3 class="mb-4 text-lg font-medium">
        基本信息
      </h3>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>标题</FormLabel>
            <FormControl>
              <Input v-model="photo.title" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="caption">
          <FormItem>
            <FormLabel>描述</FormLabel>
            <FormControl>
              <Input v-model="photo.caption" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="tags" class="lg:col-span-2">
          <FormItem>
            <FormLabel>标签</FormLabel>
            <FormControl>
              <TagsInput v-model="photo.tags">
                <TagsInputItem v-for="tag in photo.tags?.split(',') || []" :key="tag" :value="tag">
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
                <TagsInputInput placeholder="添加标签..." />
              </TagsInput>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="semanticDescription" class="lg:col-span-4">
          <FormItem>
            <FormLabel>语义描述</FormLabel>
            <FormControl>
              <Textarea v-model="photo.semanticDescription" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <!-- Camera Information -->
      <h3 class="mb-4 text-lg font-medium">
        相机信息
      </h3>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
        <FormField v-slot="{ componentField }" name="make">
          <FormItem>
            <FormLabel>相机品牌</FormLabel>
            <FormControl>
              <Input v-model="photo.make" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="model">
          <FormItem>
            <FormLabel>相机型号</FormLabel>
            <FormControl>
              <Input v-model="photo.model" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <!-- Lens Information -->
      <h3 class="mb-4 text-lg font-medium">
        镜头信息
      </h3>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
        <FormField v-slot="{ componentField }" name="lensMake">
          <FormItem>
            <FormLabel>镜头品牌</FormLabel>
            <FormControl>
              <Input v-model="photo.lensMake" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="lensModel">
          <FormItem>
            <FormLabel>镜头型号</FormLabel>
            <FormControl>
              <Input v-model="photo.lensModel" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="focalLength">
          <FormItem>
            <FormLabel>焦距</FormLabel>
            <FormControl>
              <Input v-model.number="photo.focalLength" type="number" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="focalLengthIn35mmFormat">
          <FormItem>
            <FormLabel>等效35mm焦距</FormLabel>
            <FormControl>
              <Input v-model.number="photo.focalLengthIn35mmFormat" type="number" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <!-- Exposure Settings -->
      <h3 class="mb-4 text-lg font-medium">
        曝光设置
      </h3>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
        <FormField v-slot="{ componentField }" name="fNumber">
          <FormItem>
            <FormLabel>光圈</FormLabel>
            <FormControl>
              <Input v-model.number="photo.fNumber" type="number" step="0.1" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="iso">
          <FormItem>
            <FormLabel>ISO</FormLabel>
            <FormControl>
              <Input v-model.number="photo.iso" type="number" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="exposureTime">
          <FormItem>
            <FormLabel>快门速度</FormLabel>
            <FormControl>
              <Input v-model.number="photo.exposureTime" type="number" step="0.001" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="exposureCompensation">
          <FormItem>
            <FormLabel>曝光补偿</FormLabel>
            <FormControl>
              <Input v-model.number="photo.exposureCompensation" type="number" step="0.1" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <!-- Location Information -->
      <h3 class="mb-4 text-lg font-medium">
        位置信息
      </h3>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
        <FormField v-slot="{ componentField }" name="locationName">
          <FormItem>
            <FormLabel>地点名称</FormLabel>
            <FormControl>
              <Input v-model="photo.locationName" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="latitude">
          <FormItem>
            <FormLabel>纬度</FormLabel>
            <FormControl>
              <Input v-model.number="photo.latitude" type="number" step="0.000001" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="longitude">
          <FormItem>
            <FormLabel>经度</FormLabel>
            <FormControl>
              <Input v-model.number="photo.longitude" type="number" step="0.000001" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="takenAt">
          <FormItem>
            <FormLabel>拍摄时间</FormLabel>
            <FormControl>
              <!-- <DatePickerButton v-model="photo.takenAt" mode="datetime" /> -->
              <Input v-model="photo.takenAt" type="datetime-local" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <button type="submit" class="h-10 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium ring-offset-background transition-colors disabled:pointer-events-none hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring">
        保存
      </button>
    </div>
  </Form>
</template>
