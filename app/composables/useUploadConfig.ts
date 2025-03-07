import { useLocalStorage } from '@vueuse/core'

export interface compressFormat {
  jpeg: boolean
  webp: boolean
  avif: boolean
  thumbnail: boolean
}

export interface UploadConfig {
  enableCompression: boolean
  formats: compressFormat
}

export function useUploadConfig() {
  const config = useLocalStorage<UploadConfig>('upload-config', {
    enableCompression: false,
    formats: {
      jpeg: false,
      webp: true,
      avif: false,
      thumbnail: true,
    },
  })

  return {
    config,
  }
}
