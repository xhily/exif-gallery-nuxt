<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const { config: uploadConfig } = useUploadConfig()
const { config: aiConfig, providers } = useAIConfig()
</script>

<template>
  <div
    class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  >
    <UploadConfigCard>
      <template #status>
        <ItemStatus :label="$t('compression_config.title')" :checked="uploadConfig.enableCompression" />
        <Card v-if="uploadConfig.enableCompression" class="flex flex-wrap gap-2 px-2">
          <ItemStatus :label="$t('compression_config.jpeg')" :checked="uploadConfig.formats.jpeg" />
          <ItemStatus :label="$t('compression_config.webp')" :checked="uploadConfig.formats.webp" />
          <ItemStatus :label="$t('compression_config.avif')" :checked="uploadConfig.formats.avif" />
        </Card>
        <ItemStatus :label="$t('compression_config.thumbnail')" :checked="uploadConfig.formats.thumbnail" />
      </template>
      <template #config>
        <Collapsible :open="uploadConfig.enableCompression">
          <div class="flex items-center space-x-2">
            <Checkbox
              id="enable-compression"
              v-model:checked="uploadConfig.enableCompression"
            />
            <Label for="enable-compression">{{ $t('compression_config.enable') }}</Label>
          </div>
          <CollapsibleContent>
            <div class="pl-6">
              <Label class="text-muted-foreground font-medium">{{ $t('compression_config.formats') }}</Label>
              <div class="flex flex-wrap gap-2">
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id="formats-jpeg"
                    v-model:checked="uploadConfig.formats.jpeg"
                  />
                  <Label for="formats-jpeg">{{ $t('compression_config.jpeg') }}</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id="formats-webp"
                    v-model:checked="uploadConfig.formats.webp"
                  />
                  <Label for="formats-webp">{{ $t('compression_config.webp') }}</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id="formats-avif"
                    v-model:checked="uploadConfig.formats.avif"
                  />
                  <Label for="formats-avif">{{ $t('compression_config.avif') }}</Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="formats-thumbnail"
            v-model:checked="uploadConfig.formats.thumbnail"
          />
          <Label for="formats-thumbnail">{{ $t('compression_config.thumbnail') }}</Label>
        </div>
      </template>
    </UploadConfigCard>

    <UploadConfigCard>
      <template #status>
        <ItemStatus :label="$t('ai_config.title')" :checked="aiConfig.enabled">
          <span>{{ $t('ai_config.title') }}</span>
          <Badge v-if="aiConfig.enabled" variant="outline" class="ml-2 rounded-lg">
            {{ aiConfig.provider }}
          </Badge>
        </ItemStatus>
      </template>
      <template #config>
        <Collapsible :open="aiConfig.enabled">
          <div class="flex items-center space-x-2">
            <Checkbox
              id="enable-ai"
              v-model:checked="aiConfig.enabled"
            />
            <Label for="enable-ai">{{ $t('ai_config.enable') }}</Label>
          </div>
          <CollapsibleContent>
            <div class="ml-6 space-y-2">
              <div>
                <Label for="ai-provider">{{ $t('ai_config.provider') }}</Label>
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
                <Label for="secret-key">{{ $t('ai_config.secret_key') }}</Label>
                <Input
                  id="secret-key"
                  v-model="aiConfig.secretKey"
                  type="password"
                  class="h-8 py-1"
                  :placeholder="$t('ai_config.secret_key_placeholder')"
                />
              </div>
              <div>
                <Label for="base-url">{{ $t('ai_config.base_url') }}</Label>
                <Input
                  id="base-url"
                  v-model="aiConfig.baseUrl"
                  class="h-8 py-1"
                  :placeholder="$t('ai_config.base_url_placeholder')"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </template>
    </UploadConfigCard>
  </div>
</template>
