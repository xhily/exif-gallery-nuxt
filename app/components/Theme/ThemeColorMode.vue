<script setup lang="ts">
const colorMode = useColorMode()

// 当前主题的图标
const currentIcon = computed(() => {
  if (colorMode.preference === 'dark')
    return 'i-lucide-moon' // 暗色模式
  if (colorMode.preference === 'light')
    return 'i-lucide-sun' // 亮色模式
  return 'i-lucide-monitor' // 跟随系统模式
})

// 切换主题逻辑
function toggleTheme() {
  if (colorMode.preference === 'dark') {
    colorMode.preference = 'light'
  }
  else if (colorMode.preference === 'light') {
    colorMode.preference = 'system'
  }
  else {
    colorMode.preference = 'dark'
  }
}
</script>

<template>
  <UButton
    :icon="currentIcon"
    variant="ghost"
    size="sm"
    aria-label="Toggle Theme Mode"
    @click="toggleTheme"
  />
</template>
