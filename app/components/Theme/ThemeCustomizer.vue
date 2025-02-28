<script lang="ts" setup>
const { theme, radius } = useTheme()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function reset() {
  theme.value = 'zinc'
  radius.value = '0.5'
}

const colorModeValues = [{
  value: 'light',
  icon: 'i-lucide-sun',
  label: 'Light',
}, {
  value: 'dark',
  icon: 'i-lucide-moon',
  label: 'Dark',
}, {
  value: 'system',
  icon: 'i-lucide-moon',
  label: 'System',
}]
</script>

<template>
  <div class="flex flex-col space-y-4 md:space-y-6">
    <div class="flex items-start pt-4 md:pt-0">
      <div class="pr-2 space-y-1">
        <div class="font-semibold leading-none tracking-tight">
          Theme Customizer
        </div>
        <div class="text-xs text-muted-foreground">
          Customize your components colors.
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="ml-auto rounded-[0.5rem]"
        @click="reset()"
      >
        <div class="i-lucide-repeat" />
        <span class="sr-only">Reset</span>
      </Button>
    </div>
    <div class="flex flex-1 flex-col space-y-4 md:space-y-6">
      <div class="space-y-1.5">
        <Label for="color" class="text-xs"> Color </Label>
        <div class="grid grid-cols-3 gap-2">
          <Button
            v-for="(color, index) in baseColors"
            :key="index"
            variant="outline"
            class="h-8 justify-start px-3"
            :class="
              color.name === theme
                ? 'border-foreground border-2'
                : ''
            "
            :style="{
              '--theme-primary': `hsl(${
                color?.activeColor[isDark ? 'dark' : 'light']
              })`,
            }"
            @click="theme = color.name"
          >
            <span
              class="h-5 w-5 flex shrink-0 items-center justify-center rounded-full bg-[--theme-primary]"
            >
              <Check
                v-if="color.name === theme"
                class="h-3 w-3 text-white"
              />
            </span>
            <span class="ml-2 text-xs capitalize">
              {{ color.name }}
            </span>
          </Button>
        </div>
      </div>
      <div class="space-y-1.5">
        <Label for="radius" class="text-xs"> Radius </Label>
        <div class="grid grid-cols-5 gap-2">
          <Button
            v-for="(r, index) in RADII"
            :key="index"
            variant="outline"
            class="h-8 justify-center px-3"
            :class="
              r === radius
                ? 'border-foreground border-2'
                : ''
            "
            @click="radius = r"
          >
            <span class="text-xs">
              {{ r }}
            </span>
          </Button>
        </div>
      </div>
      <div class="space-y-1.5">
        <Label for="theme" class="text-xs"> Theme </Label>

        <div class="flex space-x-2">
          <Button
            v-for="(colorModeValue, index) in colorModeValues"
            :key="index"
            variant="outline"
            class="h-8"
            :class="{ 'border-2 border-foreground': colorMode.preference === colorModeValue.value }"
            @click="colorMode.preference = colorModeValue.value"
          >
            <div class="mr-2" :class="colorModeValue.icon" />
            <span class="text-xs">{{ colorModeValue.label }}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
