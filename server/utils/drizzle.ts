import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

export { and, eq, or, sql } from 'drizzle-orm'

export const tables = schema

export function useDB() {
  return drizzle(hubDatabase(), { schema })
}
export type DBType = ReturnType<typeof useDB>
export type DBTransaction = Parameters<Parameters<DBType['transaction']>[0]>[0]
export type Photo = typeof schema.photo.$inferSelect
