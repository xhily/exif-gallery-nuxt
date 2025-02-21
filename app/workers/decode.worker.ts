import { decode as decodeAvif } from '@jsquash/avif'
import { decode as decodeJpeg } from '@jsquash/jpeg'
import { decode as decodePng } from '@jsquash/png'
import { decode as decodeWebp } from '@jsquash/webp'

globalThis.onmessage = async (e) => {
  const { file }: { file: File } = e.data

  try {
    const arrayBuffer = await file.arrayBuffer()
    let imageData: Awaited<ReturnType<typeof decodeJpeg>> | undefined
    const fileType = file.type

    if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
      imageData = await decodeJpeg(arrayBuffer)
    }
    else if (fileType === 'image/png') {
      imageData = await decodePng(arrayBuffer)
    }
    else if (fileType === 'image/webp') {
      imageData = await decodeWebp(arrayBuffer)
    }
    else if (fileType === 'image/avif') {
      imageData = await decodeAvif(arrayBuffer)
    }

    if (!imageData) {
      globalThis.postMessage({ success: false, error: 'Unsupported image format, skip' })
      return
    }

    globalThis.postMessage({ success: true, result: imageData })
  }
  catch (error) {
    console.error('Decode Worker error:', error)
    globalThis.postMessage({ success: false, error })
  }
}
