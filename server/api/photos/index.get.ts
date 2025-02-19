import { and, eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const db = useDB()
  const { uploading, hidden } = getQuery(event)
  const conditions = []

  if (uploading !== undefined)
    conditions.push(eq(tables.photo.uploading, Boolean(uploading)))

  if (hidden !== undefined)
    conditions.push(eq(tables.photo.hidden, Boolean(hidden)))

  const photos = await db.query.photo.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
  })
  return photos
})
