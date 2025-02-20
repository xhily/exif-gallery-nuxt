import { decode as decodeAvif, encode as encodeAvif } from '@jsquash/avif'
import { decode as decodeJpeg, encode as encodeJpeg } from '@jsquash/jpeg'
import { decode as decodePng } from '@jsquash/png'
import resize from '@jsquash/resize'
import { decode as decodeWebp, encode as encodeWebp } from '@jsquash/webp'

globalThis.onmessage = async (e) => {
  const { file, options: incomeOptions }: { file: File, options: CompressionOptions } = e.data

  const options = {
    ...{
      formats: {
        jpeg: false,
        webp: true,
        avif: false,
        thumbnail: false,
      },
      ...incomeOptions,
    },
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    let imageData
    const fileType = file.type

    if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
      imageData = await decodeJpeg(arrayBuffer)
    }
    if (fileType === 'image/png') {
      imageData = await decodePng(arrayBuffer)
    }
    if (fileType === 'image/webp') {
      imageData = await decodeWebp(arrayBuffer)
    }
    if (fileType === 'image/avif') {
      imageData = await decodeAvif(arrayBuffer)
    }

    if (!imageData) {
      globalThis.postMessage({ success: false, error: 'Unsupported image format, skip' })
      return
    }

    const result: compressFiles = {}

    if (options.formats.jpeg && !['image/webp', 'image/avif'].includes(fileType)) {
      const jpegData = await encodeJpeg(imageData, { quality: options.quality?.jpeg || 75 })
      result.jpeg = new File([jpegData], `${file.name.split('.')[0]}.jpg`, {
        type: 'image/jpeg',
      })
    }

    if (options.formats.webp && !['image/webp', 'image/avif'].includes(fileType)) {
      const webpData = await encodeWebp(imageData, { quality: options.quality?.webp || 75 })
      result.webp = new File([webpData], `${file.name.split('.')[0]}.webp`, {
        type: 'image/webp',
      })
    }

    if (options.formats.avif && !['image/avif'].includes(fileType)) {
      const avifData = await encodeAvif(imageData, { quality: options.quality?.avif || 50 })
      result.avif = new File([avifData], `${file.name.split('.')[0]}.avif`, {
        type: 'image/avif',
      })
    }

    if (options.formats.thumbnail) {
      let thumbnailWidth = options.thumbnailWidth
      let thumbnailHeight = options.thumbnailHeight
      if (!thumbnailHeight && !thumbnailWidth) {
        thumbnailHeight = 150
      }
      if (!thumbnailWidth && thumbnailHeight) {
        const imageRatio = imageData.width / imageData.height
        thumbnailWidth = Math.round(thumbnailHeight * imageRatio)
      }
      if (!thumbnailHeight && thumbnailWidth) {
        const imageRatio = imageData.width / imageData.height
        thumbnailHeight = Math.round(thumbnailWidth / imageRatio)
      }

      const thumbnailData = await resize(imageData, {
        width: thumbnailWidth || 200,
        height: thumbnailHeight || 150,
        fitMethod: 'contain',
      })

      const thumbnail = await encodeJpeg(thumbnailData, { quality: options.quality?.thumbnail || 75 })
      result.thumbnail = new File([thumbnail], `${file.name.split('.')[0]}_thumb.jpg`, {
        type: 'image/jpeg',
      })
    }

    globalThis.postMessage({ success: true, result })
  }
  catch (error) {
    globalThis.postMessage({ success: false, error })
  }
}
