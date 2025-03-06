import type { DBType } from './drizzle'
import { eq, inArray } from 'drizzle-orm'
import { tables } from './drizzle'

export async function processPhotoTags(db: DBType, photoId: string, tags: string | null | undefined) {
  if (tags === undefined || tags === null)
    return

  const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean)
  if (tagNames.length === 0)
    return

  // First, find all existing tags in one query
  const existingTags = await db.query.tag.findMany({
    where: inArray(tables.tag.name, tagNames),
  })

  // Create a map of tag names to their IDs for quick lookup
  const tagMap = new Map(existingTags.map(tag => [tag.name, tag.id]))

  // Prepare operations for new tags
  const newTagOperations = tagNames
    .filter(name => !tagMap.has(name))
    .map(name => ({
      name,
    }))

  // Insert new tags if any
  let newTags = []
  if (newTagOperations.length > 0) {
    newTags = await db.insert(tables.tag)
      .values(newTagOperations)
      .returning()

    // Add new tags to the map
    newTags.forEach(tag => tagMap.set(tag.name, tag.id))
  }

  // Delete existing photo-tag relationships
  await db.delete(tables.photoTag)
    .where(eq(tables.photoTag.photoId, photoId))

  // Create new photo-tag relationships
  const photoTagOperations = tagNames
    .map(name => ({
      photoId,
      tagId: tagMap.get(name)!,
    }))

  if (photoTagOperations.length > 0) {
    await db.insert(tables.photoTag)
      .values(photoTagOperations)
      .onConflictDoNothing()
  }
}
