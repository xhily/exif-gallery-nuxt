import { desc, sql } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const db = useDB()
  const query = getQuery(event)
  const { limit, offset } = query

  const tags = await db
    .select({
      id: tables.tag.id,
      name: tables.tag.name,
      createdAt: tables.tag.createdAt,
      photoCount: tables.tag.photoCount,
    })
    .from(tables.tag)
    .orderBy(desc(tables.tag.photoCount))
    .limit(limit ? Number(limit) : 9999999)
    .offset(offset ? Number(offset) : 0)

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.tag)
    .get()

  return {
    data: tags,
    total: total?.count || 0,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  }
})
