import type { BlobObject } from '@nuxthub/core'
import type { UseSwipeDirection } from '@vueuse/core'
import type { FilePlugin } from '../../types'

export function useImageGallery() {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const imageToDownload = ref<HTMLImageElement>()
  const router = useRouter()
  const route = useRoute()

  const file = nuxtApp.$file as FilePlugin

  const currentIndex: ComputedRef<number> = computed(() => file.images.value!.findIndex((image: BlobObject) => image.pathname.split('.')[0] === route.params.slug![0]))
  const isFirstImg: ComputedRef<boolean> = computed(() => file.images.value?.[0]?.pathname.split('.')[0] === route.params.slug![0] || false)
  const isLastImg: ComputedRef<boolean> = computed(() => file.images.value?.[file.images.value.length - 1]?.pathname.split('.')[0] === route.params.slug![0] || false)

  const initSwipe = (el: Ref<HTMLImageElement | undefined>) => {
    useSwipe(el, {
      passive: false,

      onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
        if (direction === 'left') {
          if (isLastImg.value)
            router.push('/')
          else
            router.push(`/detail/${file.images.value![currentIndex.value + 1]?.pathname.split('.')[0]}`)
        }
        else {
          if (isFirstImg.value)
            router.push('/')
          else
            router.push(`/detail/${file.images.value![currentIndex.value - 1]?.pathname.split('.')[0]}`)
        }
      },
    })
  }

  const downloadImage = async (filename: string) => {
    if (!imageToDownload.value) {
      return
    }

    await useFetch(imageToDownload.value.src, {
      baseURL: `${config.public.imageApi}/ipx/_/tmdb/`,
    }).then((response) => {
      const blob = response.data.value as Blob
      const url: string = URL.createObjectURL(blob)
      const link: HTMLAnchorElement = document.createElement('a')

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.click()
    })
  }

  const convertBase64ToFile = async (image: Ref<HTMLImageElement>, originalImage: Ref<BlobObject>) => {
    const url = image.value.currentSrc

    const response = await fetch(url)
    const blob = await response.blob()

    const convertedFile = new File([blob], `${Math.random().toString().split('.')[1]}.${originalImage.value?.contentType?.split('/').pop()}`, { type: originalImage.value.contentType })

    return convertedFile as File
  }
  return {
    downloadImage,
    convertBase64ToFile,
    initSwipe,
    currentIndex,
    isFirstImg,
    isLastImg,
  }
}
