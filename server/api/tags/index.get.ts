import { sql } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const db = useDB()
  const query = getQuery(event)
  const { limit, offset } = query

  const tags = await db.query.tag.findMany({
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
    orderBy: sql`${tables.tag.name} ASC`,
  })

  const total = await db.select({ count: sql<number>`count(*)` })
    .from(tables.tag)
    .get()

  return {
    data: tags,
    total: total?.count || 0,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  }
})