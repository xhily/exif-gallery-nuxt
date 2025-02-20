import CompressWorker from '~/workers/compress.worker.ts?worker'

interface CompressionOptions {
  quality?: number
  width?: number
  height?: number
  generateThumbnail?: boolean
  thumbnailSize?: number
  format?: compressFormat
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
  const defaultOptions = {
    quality: 0.8,
    generateThumbnail: false,
    thumbnailSize: 300,
    format: 'webp-avif',
  }

  const worker = new CompressWorker()

  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      worker.terminate()
      if (e.data.success) {
        resolve(e.data.result)
      } else {
        reject(new Error(e.data.error))
      }
    }

    worker.onerror = (error) => {
      worker.terminate()
      reject(error)
    }

    worker.postMessage({
      file,
      options: { ...defaultOptions, ...options },
    })
  })
}

// /**
//  * Compresses multiple images in parallel with a concurrency limit
//  */
// export async function compressImages(
//   files: File[],
//   options: CompressionOptions = {},
//   concurrency = 2,
// ): Promise<Map<string, CompressionResult>> {
//   const results = new Map<string, CompressionResult>()
//   const queue = [...files]
//   const processing = new Set<Promise<void>>()

//   while (queue.length > 0 || processing.size > 0) {
//     if (queue.length > 0 && processing.size < concurrency) {
//       const file = queue.shift()!
//       let processPromise: Promise<void>
//       processPromise = (async () => {
//         try {
//           const result = await compressImage(file, options)
//           results.set(file.name, result)
//         }
//         catch (error) {
//           console.error(`Failed to compress ${file.name}:`, error)
//         }
//         finally {
//           processing.delete(processPromise)
//         }
//       })()
//       processing.add(processPromise)
//     }
//     else {
//       await Promise.race(processing)
//     }
//   }

//   return results
// }
