import { eq } from 'drizzle-orm'
import { tables } from './drizzle'

export async function processPhotoTags(tx: DBTransaction, photoId: string, tags: string | null | undefined) {
  if (tags === undefined || tags === null)
    return

  const tagNames = tags.split(',').filter(t => t.trim()).map(t => t.trim())

  await tx.delete(tables.photoTag)
    .where(eq(tables.photoTag.photoId, photoId))

  for (const tagName of tagNames) {
    if (!tagName)
      continue

    let tagRecord = await tx.query.tag.findFirst({
      where: eq(tables.tag.name, tagName),
    })

    if (!tagRecord) {
      const newTags = await tx.insert(tables.tag)
        .values({
          name: tagName,
        })
        .returning()

      tagRecord = newTags[0]
    }

    await tx.insert(tables.photoTag)
      .values({
        photoId,
        tagId: tagRecord.id,
      })
      .onConflictDoNothing()
  }
}
