import exifr from 'exifr'

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
    aspectRatio: exifData?.ImageHeight ? exifData.ImageWidth / exifData.ImageHeight : 1.5,
  }

  return photo
}
