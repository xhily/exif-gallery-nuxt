<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const { config: uploadConfig } = useUploadConfig()
const { config: aiConfig, providers } = useAIConfig()
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  >
    <UCard :ui="{ footer: { base: 'space-y-2' } }">
      <UFormGroup>
        <UCheckbox
          v-model="uploadConfig.enableCompression"
          label="启用图片压缩优化"
        />
      </UFormGroup>
      <template v-if="uploadConfig.enableCompression" #footer>
        <UFormGroup label="压缩目标">
          <div class="space-y-2">
            <UCheckbox
              id="formats-jpeg"
              v-model="uploadConfig.formats.jpeg"
              label="JPEG"
            />
            <UCheckbox
              id="formats-webp"
              v-model="uploadConfig.formats.webp"
              label="WebP"
            />
            <UCheckbox
              id="formats-avif"
              v-model="uploadConfig.formats.avif"
              label="AVIF"
            />
            <UCheckbox
              id="formats-thumbnail"
              v-model="uploadConfig.formats.thumbnail"
              label="缩略图"
            />
          </div>
        </UFormGroup>
      </template>
    </UCard>
    <UCard :ui="{ footer: { base: 'space-y-2' } }">
      <UFormGroup>
        <UCheckbox
          v-model="aiConfig.enabled"
          label="启用AI特征提取"
        />
      </UFormGroup>
      <template v-if="aiConfig.enabled" #footer>
        <UFormGroup label="AI服务商">
          <USelectMenu
            v-model="aiConfig.provider"
            :options="providers"
            value-attribute="value"
            label-attribute="label"
          />
        </UFormGroup>
        <UFormGroup label="密钥">
          <UInput
            v-model="aiConfig.secretKey"
            name="secretKey"
            type="password"
            placeholder="请输入API密钥"
          />
        </UFormGroup>
        <UFormGroup label="API地址">
          <UInput
            v-model="aiConfig.baseUrl"
            name="baseUrl"
            placeholder="请输入API地址，空则使用默认地址"
          />
        </UFormGroup>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>
