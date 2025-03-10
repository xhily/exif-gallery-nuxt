<script setup lang="ts">
import type { Props as ButtonProps } from './ui/button/Button.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()

interface Props extends ButtonProps {
  icon?: string
  label: string
}

const buttonProps = computed(() => {
  const { icon: _i, label: _l, ...delegated } = props
  delegated.variant = delegated.variant || 'ghost'
  delegated.size = delegated.size || 'icon'
  return delegated
})

const attrs = useAttrs()
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <slot>
        <Button
          v-bind="{ ...attrs, ...buttonProps }"
        >
          <div :class="icon" />
        </Button>
      </slot>
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ label }}</p>
    </TooltipContent>
  </Tooltip>
</template>

<style scoped>

</style>
