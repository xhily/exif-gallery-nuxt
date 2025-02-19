<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const { config: uploadConfig, optimizationTargets } = useUploadConfig()
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
          <UFormGroup label="优化目标">
            <USelectMenu
              v-model="uploadConfig.optimizationTarget"
              :options="optimizationTargets"
              value-attribute="value"
              label-attribute="label"
            />
          </UFormGroup>
          <UFormGroup label="生成缩略图">
            <UCheckbox
              v-model="uploadConfig.generateThumbnail"
            />
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
          <UFormGroup label="API地址">
            <UInput
              v-model="aiConfig.baseUrl"
              name="baseUrl"
              placeholder="请输入API地址"
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
        </template>
      </UCard>
    </div>
</template>

<style scoped>

</style>
