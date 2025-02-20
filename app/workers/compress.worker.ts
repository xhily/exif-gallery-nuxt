import { encode as encodeAvif } from '@jsquash/avif'
import { decode as decodeJpeg, encode as encodeJpeg } from '@jsquash/jpeg'
import resize from '@jsquash/resize'
import { decode as decodeWebp, encode as encodeWebp } from '@jsquash/webp'

self.onmessage = async (e) => {
  const { file, options } = e.data

  try {
    const arrayBuffer = await file.arrayBuffer()
    let imageData
    const isWebp = file.type === 'image/webp'

    if (isWebp) {
      imageData = await decodeWebp(arrayBuffer)
    }
    else {
      imageData = await decodeJpeg(arrayBuffer)
    }

    const result = {}

    if (options.generateThumbnail) {
      const thumbnailData = await resize(imageData, {
        width: options.thumbnailSize,
        height: options.thumbnailSize,
        fitMethod: 'contain',
      })

      const thumbnailWebp = await encodeWebp(thumbnailData, { quality: options.quality })
      result.thumbnail = new File([thumbnailWebp], `${file.name.split('.')[0]}_thumb.webp`, {
        type: 'image/webp',
      })
    }

    if (options.format === 'compress-only') {
      if (!isWebp) {
        const jpegData = await encodeJpeg(imageData, { quality: options.quality })
        result.jpeg = new File([jpegData], `${file.name.split('.')[0]}.jpg`, {
          type: 'image/jpeg',
        })
      }
    }
    else {
      if (options.format === 'webp' || options.format === 'webp-avif') {
        const webpData = await encodeWebp(imageData, { quality: options.quality })
        result.webp = new File([webpData], `${file.name.split('.')[0]}.webp`, {
          type: 'image/webp',
        })
      }

      if (options.format === 'avif' || options.format === 'webp-avif') {
        const avifData = await encodeAvif(imageData, { quality: options.quality })
        result.avif = new File([avifData], `${file.name.split('.')[0]}.avif`, {
          type: 'image/avif',
        })
      }
    }

    self.postMessage({ success: true, result })
  }
  catch (error) {
    self.postMessage({ success: false, error: error.message })
  }
}
