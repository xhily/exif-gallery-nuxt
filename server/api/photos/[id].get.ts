import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { id } = event.context.params || {}

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id is required',
    })
  }

  const db = useDB()
  const photo = await db.query.photo.findFirst({
    where: eq(tables.photo.id, id),
  })

  if (!photo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Photo not found',
    })
  }

  return photo
})
