import { useLocalStorage } from '@vueuse/core'

export interface UploadConfig {
  enableCompression: boolean
  optimizationTarget: 'compress-only' | 'webp' | 'avif' | 'webp-avif'
  generateThumbnail: boolean
}

export const optimizationTargets = [
  { label: '仅压缩', value: 'compress-only' },
  { label: 'WebP', value: 'webp' },
  { label: 'AVIF', value: 'avif' },
  { label: 'WebP + AVIF', value: 'webp-avif' },
]

export function useUploadConfig() {
  const config = useLocalStorage<UploadConfig>('upload-config', {
    enableCompression: false,
    optimizationTarget: 'compress-only',
    generateThumbnail: false,
  })

  return {
    config,
    optimizationTargets,
  }
}
