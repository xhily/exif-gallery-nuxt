<script setup lang="ts">
const cardRef = useTemplateRef('cardRef')
const configuring = ref(false)
onClickOutside(cardRef, () => {
  configuring.value = false
})
</script>

<template>
  <Card
    ref="cardRef"
    class="group relative overflow-hidden p-4"
    :class="{ 'cursor-pointer': !configuring }"
    @click="configuring = true"
  >
    <ClientOnly>
      <Collapsible v-model:open="configuring">
        <CollapsibleTrigger v-show="!configuring">
          <div v-if="!configuring" class="flex flex-wrap gap-2">
            <div class="i-lucide-cog pointer-events-none absolute bottom--4 right--2 text-6xl op-20 group-hover:animate-spin animate-duration-2000!" />
            <slot name="status" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div class="flex flex-col gap-2">
            <slot name="config" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </ClientOnly>
  </Card>
</template>
