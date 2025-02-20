import { useLocalStorage } from '@vueuse/core'

export type compressFormat = 'compress-only' | 'webp' | 'avif' | 'webp-avif'

export interface UploadConfig {
  enableCompression: boolean
  optimizationTarget: compressFormat
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
