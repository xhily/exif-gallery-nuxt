<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const { config: uploadConfig } = useUploadConfig()
const { config: aiConfig, providers } = useAIConfig()

const compressCardRef = useTemplateRef('compressCardRef')
const compressConfiguring = ref(false)
onClickOutside(compressCardRef, () => {
  compressConfiguring.value = false
})

const aiCardRef = useTemplateRef('aiCardRef')
const aiConfiguring = ref(false)
onClickOutside(aiCardRef, () => {
  aiConfiguring.value = false
})
</script>

<template>
  <div
    class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  >
    <Card
      ref="compressCardRef"
      class="relative overflow-hidden p-4"
      :class="{ 'cursor-pointer': !compressConfiguring }"
      @click="compressConfiguring = true"
    >
      <ClientOnly>
        <div v-if="!compressConfiguring" class="flex flex-wrap gap-2">
          <div class="i-lucide-cog pointer-events-none absolute bottom--4 right--2 text-6xl op-20" />
          <ItemStatus label="压缩优化" :checked="uploadConfig.enableCompression" />
          <Card v-if="uploadConfig.enableCompression" class="flex flex-wrap gap-2 px-2">
            <ItemStatus label="Jpeg" :checked="uploadConfig.formats.jpeg" />
            <ItemStatus label="Webp" :checked="uploadConfig.formats.webp" />
            <ItemStatus label="Avif" :checked="uploadConfig.formats.avif" />
          </Card>
          <ItemStatus label="缩略图" :checked="uploadConfig.formats.thumbnail" />
        </div>
        <div v-else class="flex flex-col gap-2">
          <div>
            <div class="flex items-center space-x-2">
              <Checkbox
                id="enable-compression"
                v-model:checked="uploadConfig.enableCompression"
              />
              <Label for="enable-compression">启用图片压缩优化</Label>
            </div>
            <div v-if="uploadConfig.enableCompression" class="pl-6">
              <Label class="text-muted-foreground font-medium">压缩目标</Label>
              <div class="flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox
              id="enable-compression"
              v-model:checked="uploadConfig.formats.thumbnail"
            />
            <Label for="enable-compression">生成缩略图</Label>
          </div>
        </div>
      </ClientOnly>
    </Card>

    <Card
      ref="aiCardRef"
      class="relative overflow-hidden p-4"
      :class="{ 'cursor-pointer': !aiConfiguring }"
      @click="aiConfiguring = true"
    >
      <ClientOnly>
        <div v-if="!aiConfiguring" class="flex flex-wrap gap-2">
          <div class="i-lucide-cog pointer-events-none absolute bottom--4 right--2 text-6xl op-20" />
          <ItemStatus label="压缩优化" :checked="aiConfig.enabled">
            <span>AI特征提取</span>
            <Badge v-if="aiConfig.enabled" variant="outline" class="ml-2 rounded-lg">
              {{ aiConfig.provider }}
            </Badge>
          </ItemStatus>
        </div>
        <div v-else>
          <div class="flex items-center space-x-2">
            <Checkbox
              id="enable-ai"
              v-model:checked="aiConfig.enabled"
            />
            <Label for="enable-ai">启用AI特征提取</Label>
          </div>
          <div v-if="aiConfig.enabled" class="ml-6 space-y-2">
            <div>
              <Label for="ai-provider">AI服务商</Label>
              <Select id="ai-provider" v-model="aiConfig.provider">
                <SelectTrigger class="h-8 py-1">
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
            <div>
              <Label for="secret-key">密钥</Label>
              <Input
                id="secret-key"
                v-model="aiConfig.secretKey"
                type="password"
                class="h-8 py-1"
                placeholder="请输入API密钥"
              />
            </div>
            <div>
              <Label for="base-url">API地址</Label>
              <Input
                id="base-url"
                v-model="aiConfig.baseUrl"
                class="h-8 py-1"
                placeholder="请输入API地址，空则使用默认地址"
              />
            </div>
          </div>
        </div>
      </ClientOnly>
    </Card>
  </div>
</template>
