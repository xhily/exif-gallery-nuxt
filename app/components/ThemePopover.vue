<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <TooltipIconButton
        v-bind="attrs"
        :label="$t('header.theme')"
        icon="i-lucide-paintbrush"
        :disable-closing-trigger="false"
      />
      <!-- <Button
        variant="ghost"
        size="icon"
        v-bind="attrs"
      >
        <div class="i-lucide-paintbrush" />
      </Button> -->
    </PopoverTrigger>
    <PopoverContent :side-offset="8" align="end" class="w-96">
      <ThemeCustomizer :all-colors="allColors" />
    </PopoverContent>
  </Popover>
</template>
