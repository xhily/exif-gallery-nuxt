<script setup lang="ts">
const bottomMenu = ref()
const imageEl = ref<HTMLImageElement>()
const imageContainer = ref<HTMLElement>()

// const { loggedIn } = useUserSession()

const route = useRoute()
const router = useRouter()

const pathname = route.params.slug?.[0]

if (!pathname) {
  router.push('/')
}

const { isFirstImg, isLastImg, downloadImage, initSwipe } = useImageGallery()

onMounted(() => {
  initSwipe(imageEl)
})
</script>

<template>
  <div v-if="pathname">
    <!-- background -->
    <div class="absolute inset-0 w-full h-full">
      <img
        :src="`/photos/${pathname}`"
        class="object-contain w-full h-full"
        alt=""
      >
    </div>

    <UContainer v-if="false" class="overflow-x-hidden relative flex items-center justify-center">
      <div class="h-full w-full max-w-7xl flex items-center justify-center relative mx-auto">
        <!-- Bottom menu -->
        <div
          class="transition-all duration-200 overflow-hidden pt-8 flex items-center justify-center w-full h-screen relative"
        >
          <div class="flex items-center justify-center md:justify-between gap-x-4 w-full">
            <!-- previous image if not the first image -->
            <UTooltip
              v-if="!isFirstImg"
              text="Previous"
              :shortcuts="['←']"
            >
              <!-- <UButton
                variant="ghost"
                color="gray"
                :to="`/detail/${images[currentIndex - 1]?.pathname.split('.')[0]}`"
                size="lg"
                icon="i-heroicons-chevron-left"
                class="hidden md:flex ml-4"
                aria-label="Go to previous image"
                @click="active === image.pathname.split('.')[0]"
              /> -->
            </UTooltip>

            <div
              v-else
              class="flex group"
            >
              <!-- back to gallery if first movie -->
              <UTooltip
                text="Back to gallery"
                :shortcuts="['Esc']"
              >
                <!-- <UButton
                  to="/"
                  size="xl"
                  color="gray"
                  variant="ghost"
                  class="back hidden md:flex ml-4 transition-colors duration-200"
                  aria-label="Back to gallery"
                  @click="active === image.pathname.split('.')[0]"
                >
                  <UIcon
                    name="i-heroicons-rectangle-group-20-solid"
                    class="w-6 h-6"
                  />
                </UButton> -->
              </UTooltip>
            </div>

            <!-- image -->
            <div class="relative flex items-center justify-center xl:m-16">
              <div ref="imageContainer">
                <div class="group">
                  <img
                    v-if="pathname"
                    ref="imageEl"
                    :src="`/photos/${pathname}`"
                    :alt="pathname"
                    class="rounded object-contain transition-all duration-200 block w-full"
                    :class="[{ imageEl: route.params.slug?.[0] === pathname?.split('.')[0] }]"
                    crossorigin="anonymous"
                  >
                </div>
              </div>
            </div>

            <!-- next image (if not the last image) -->
            <UTooltip
              v-if="!isLastImg"
              text="Next"
              :shortcuts="['→']"
            >
              <!-- <UButton
                variant="ghost"
                color="gray"
                :to="`/detail/${images[currentIndex + 1]?.pathname.split('.')[0]}`"
                size="lg"
                icon="i-heroicons-chevron-right"
                :ui="{ rounded: 'rounded-full' }"
                class="hidden md:flex mr-4"
                aria-label="Go to next image"
                @click="active === image.pathname.split('.')[0]"
              /> -->
            </UTooltip>

            <!-- back to gallery if last image -->
            <UTooltip
              v-else
              text="Back to gallery"
              :shortcuts="['Esc']"
            >
              <div class="flex">
                <!-- <UButton
                  variant="ghost"
                  color="gray"
                  to="/"
                  size="xl"
                  class="back hidden md:flex mr-4 transition-colors duration-200"
                  aria-label="Back to gallery"
                  @click="active === image.pathname.split('.')[0]"
                >
                  <UIcon
                    name="i-heroicons-rectangle-group-20-solid"
                    class="w-6 h-6"
                  />
                </UButton> -->
              </div>
            </UTooltip>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .imageEl {
    view-transition-name: vtn-image;
  }

  .bottom-menu {
    view-transition-name: vtn-bottom-menu;
  }

  .bottom-menu-description {
    view-transition-name: vtn-bottom-menu-description;
  }

  .bottom-menu-button {
    view-transition-name: vtn-bottom-menu-button;
  }

  .back {
    view-transition-name: vtn-back-button;
  }
}
</style>

<style>
@keyframes slide-to-left {
  to {
    transform: translateX(0px);
  }
}

::view-transition-old(vtn-bottom-menu-description) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
  width: auto;
  opacity: 0;
}
</style>
