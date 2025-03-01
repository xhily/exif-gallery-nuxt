<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const { config: uploadConfig } = useUploadConfig()
const { config: aiConfig, providers } = useAIConfig()
</script>

<template>
  <div
    class="grid grid-cols-1 mb-6 gap-4 md:grid-cols-2"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  >
    <Card>
      <CardContent class="pt-6">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <Checkbox
              id="enable-compression"
              v-model:checked="uploadConfig.enableCompression"
            />
            <Label for="enable-compression">启用图片压缩优化</Label>
          </div>

          <div v-if="uploadConfig.enableCompression" class="space-y-4">
            <Label class="text-sm font-medium">压缩目标</Label>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="formats-jpeg"
                  v-model:checked="uploadConfig.formats.jpeg"
                />
                <Label for="formats-jpeg">JPEG</Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="formats-webp"
                  v-model:checked="uploadConfig.formats.webp"
                />
                <Label for="formats-webp">WebP</Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="formats-avif"
                  v-model:checked="uploadConfig.formats.avif"
                />
                <Label for="formats-avif">AVIF</Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="formats-thumbnail"
                  v-model:checked="uploadConfig.formats.thumbnail"
                />
                <Label for="formats-thumbnail">缩略图</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="pt-6">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <Checkbox
              id="enable-ai"
              v-model:checked="aiConfig.enabled"
            />
            <Label for="enable-ai">启用AI特征提取</Label>
          </div>

          <div v-if="aiConfig.enabled" class="space-y-4">
            <div class="space-y-2">
              <Label for="ai-provider">AI服务商</Label>
              <Select id="ai-provider" v-model="aiConfig.provider">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="provider in providers"
                    :key="provider.value"
                    :value="provider.value"
                  >
                    {{ provider.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="secret-key">密钥</Label>
              <Input
                id="secret-key"
                v-model="aiConfig.secretKey"
                type="password"
                placeholder="请输入API密钥"
              />
            </div>

            <div class="space-y-2">
              <Label for="base-url">API地址</Label>
              <Input
                id="base-url"
                v-model="aiConfig.baseUrl"
                placeholder="请输入API地址，空则使用默认地址"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
