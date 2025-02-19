interface typeInfo {
  fileName: string
  extension: string
  pathname: string
  modifyAt: Date
}

export default eventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDB()

  const formData = await readFormData(event)
  const files: { file: File, lastModified: number }[] = []

  if (formData) {
    for (const form of formData) {
      const match = form[0].match(/(file|lastModified)\[(\d+)\]/)
      if (match) {
        const [, key, i] = match
        const index = Number.parseInt(i)
        if (!files[index])
          files[index] = { file: null as any, lastModified: 0 }

        if (key === 'file')
          files[index].file = form[1] as File
        else if (key === 'lastModified')
          files[index].lastModified = Number.parseInt(form[1] as string)
      }
    }
  }

  if (files.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No File Received',
    })
  }

  const photos = files.filter(f => f.file?.type && f.file.type.startsWith('image/'))
  if (photos.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No Image File Received',
    })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/webp', 'image/avif']
  // const maxSize = 10 * 1024 * 1024

  const uploadResults = await Promise.allSettled(
    photos.map(async (photo) => {
      try {
        if (photo.file.type && !allowedTypes.includes(photo.file.type)) {
          throw createError({
            statusCode: 400,
            message: `Unsupported file type: ${photo.file.type}`,
          })
        }
        // if (photo.file.size > maxSize) {
        //   throw createError({
        //     statusCode: 400,
        //     message: 'File larger than 10MB',
        //   })
        // }

        const fileName = photo.file.name
        const extension = photo.file.name?.substring(photo.file.name.lastIndexOf('.'))
        const pathname = `Image-${createCuid()}${extension}`
        const modifyAt = new Date(photo.lastModified)

        await hubBlob().put(pathname, photo.file)
        return { success: true, fileName, extension, pathname, modifyAt }
      }
      catch (error) {
        console.error(error)
        return { success: false, error }
      }
    }),
  )

  const successfulUploads = uploadResults
    .filter((result): result is PromiseFulfilledResult<{ success: true } & typeInfo> =>
      result.status === 'fulfilled' && result.value.success)
    .map(result => result.value)

  const dbPromises = successfulUploads.map(async (result) => {
    await db.insert(tables.photo).values({
      pathname: result.pathname,
      fileName: result.fileName,
      extension: result.fileName.substring(result.fileName.lastIndexOf('.')),
      fileModifyAt: result.modifyAt,
      uploading: true,
    })
  })

  await Promise.all(dbPromises)

  const errors = uploadResults
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map(result => result.reason)

  return {
    success: successfulUploads.length > 0,
    uploaded: successfulUploads,
    errors,
  }
})
