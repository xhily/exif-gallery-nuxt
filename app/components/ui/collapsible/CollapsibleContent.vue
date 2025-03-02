<script setup lang="ts">
import type { CollapsibleContentProps } from 'radix-vue'
import { CollapsibleContent } from 'radix-vue'

const props = defineProps<CollapsibleContentProps>()
</script>

<template>
  <CollapsibleContent v-bind="props" class="transition-all data-[state=off]:overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
    <slot />
  </CollapsibleContent>
</template>
