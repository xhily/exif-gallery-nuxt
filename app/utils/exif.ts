import exifr from 'exifr'

async function getImageAspectRatio(file: File) {
  return createImageBitmap(file).then((bitmap) => {
    const aspectRatio = bitmap.width / bitmap.height
    bitmap.close()
    return aspectRatio
  }).catch(() => {
    return undefined
  })
}

export async function getExifData(file: File) {
  let photo: IPhoto = {}

  // 解析EXIF元数据
  const exifData = await exifr.parse(file)

  photo = {
    make: exifData?.Make,
    model: exifData?.Model,
    focalLength: exifData?.FocalLength,
    focalLengthIn35mmFormat: exifData?.FocalLengthIn35mmFormat,
    lensMake: exifData?.LensMake,
    lensModel: exifData?.LensModel,
    fNumber: exifData?.FNumber,
    iso: exifData?.ISO,
    exposureTime: exifData?.ExposureTime,
    exposureCompensation: exifData?.ExposureCompensation,
    locationName: exifData?.Location,
    latitude: exifData?.Latitude,
    longitude: exifData?.Longitude,
    takenAt: exifData?.DateTimeOriginal,
  }

  photo.aspectRatio = await getImageAspectRatio(file)

  return photo
}

export async function processImageRotation(file: File): Promise<File> {
  const orientation = await exifr.orientation(file)
  if (!orientation)
    return file

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' })
  if (!ctx)
    throw new Error('Failed to get canvas context')

  ctx.save()
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(img.src)
      if (!blob)
        throw new Error('Canvas toBlob failed')

      resolve(new File([blob], file.name, { type: file.type }))
    }, 'image/jpeg', 0.8)
  })
}
