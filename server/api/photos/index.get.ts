import { and, eq, sql } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const db = useDB()
  const query = getQuery(event)
  const { hidden, limit, offset, orderBy = 'createdAt', order = 'desc' } = query
  const conditions = []

  if (hidden !== undefined)
    conditions.push(eq(tables.photo.hidden, hidden === 'true'))

  const photos = await db.query.photo.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
    orderBy: (col => order === 'desc' ? sql`${col} DESC` : sql`${col} ASC`)(tables.photo[orderBy as keyof typeof tables.photo]),
  })

  const total = await db.select({ count: sql<number>`count(*)` })
    .from(tables.photo)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .get()

  return {
    data: photos,
    total: total?.count || 0,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  }
})
