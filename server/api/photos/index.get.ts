import { and, eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const db = useDB()
  const { hidden } = getQuery(event)
  const conditions = []

  if (hidden !== undefined)
    conditions.push(eq(tables.photo.hidden, hidden === 'true'))

  const photos = await db.query.photo.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
  })
  return photos
})
