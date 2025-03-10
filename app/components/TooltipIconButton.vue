<script setup lang="ts">
import type { Props as ButtonProps } from './ui/button/Button.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()

interface Props extends ButtonProps {
  icon?: string
  label: string
  disableClosingTrigger?: boolean
}

const buttonProps = computed(() => {
  const { icon: _i, label: _l, disableClosingTrigger: _d, ...delegated } = props
  delegated.variant = delegated.variant || 'ghost'
  delegated.size = delegated.size || 'icon'
  return delegated
})

const attrs = useAttrs()
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child :disable-closing-trigger="disableClosingTrigger">
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
