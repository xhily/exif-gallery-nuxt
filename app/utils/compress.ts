import CompressWorker from '~/workers/compress.worker.ts?worker'

export interface CompressionOptions {
  quality?: {
    jpeg?: number
    webp?: number
    avif?: number
    thumbnail?: number
  }
  thumbnailWidth?: number
  thumbnailHeight?: number
  formats?: Partial<compressFormat>
}

export interface compressFiles {
  jpeg?: File
  webp?: File
  avif?: File
  thumbnail?: File
}

/**
 * Compresses an image with progressive optimization (JPG -> WebP -> AVIF)
 * and generates thumbnails if requested
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<compressFiles> {
  const worker = new CompressWorker()

  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      worker.terminate()
      if (e.data.success) {
        resolve(e.data.result)
      }
      else {
        reject(new Error(e.data.error))
      }
    }

    worker.onerror = (error) => {
      worker.terminate()
      console.error('Compression worker error:', error)
      reject(error)
    }

    worker.postMessage({
      file,
      options,
    })
  })
}
