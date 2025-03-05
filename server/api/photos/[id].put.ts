import { eq } from 'drizzle-orm'
import { useValidatedBody, useValidatedParams, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, z.object({
    id: z.string().min(1, 'id is required'),
  }))

  const db = useDB()

  const updatableFields = z.object({
    title: z.string().optional(),
    caption: z.string().optional(),
    semanticDescription: z.string().optional(),
    tags: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    focalLength: z.number().int().optional(),
    focalLengthIn35mmFormat: z.number().int().optional(),
    lensMake: z.string().optional(),
    lensModel: z.string().optional(),
    fNumber: z.number().optional(),
    iso: z.number().int().optional(),
    exposureTime: z.number().optional(),
    exposureCompensation: z.number().optional(),
    locationName: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    priorityOrder: z.number().optional(),
    takenAt: z.number().optional(),
    hidden: z.boolean().optional(),
    uploading: z.boolean().optional(),
  })

  const body = await useValidatedBody(event, updatableFields)

  try {
    const photo = tables.photo

    const result = await db.transaction(async (tx) => {
      const updatedPhoto = await tx.update(photo)
        .set({
          ...body,
          takenAt: body.takenAt ? new Date(body.takenAt) : undefined,
        })
        .where(eq(photo.id, id))
        .returning()

      if (!updatedPhoto.length)
        throw createError({ statusCode: 404, message: 'photo not found' })

      await processPhotoTags(tx, id, body.tags)

      return updatedPhoto[0]
    })

    return result
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update photo',
      cause: error,
    })
  }
})
