import type { DBType } from './drizzle'
import { eq, inArray, sql } from 'drizzle-orm'
import { tables } from './drizzle'

export async function processPhotoTags(db: DBType, photoId: string, tags: string | null | undefined) {
  if (tags === undefined || tags === null)
    return

  const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean)
  if (tagNames.length === 0)
    return

  // Get current photo tags for decrementing counts
  const currentPhotoTags = await db.query.photoTag.findMany({
    where: eq(tables.photoTag.photoId, photoId),
  })

  // Get the tag IDs that need to be decremented
  const tagIdsToDecrement = currentPhotoTags.map(pt => pt.tagId)

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
      photoCount: 1, // New tags start with count 1
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

  // Delete existing photo-tag relationships and decrement counts
  if (currentPhotoTags.length > 0) {
    await db.delete(tables.photoTag)
      .where(eq(tables.photoTag.photoId, photoId))

    // Decrement counts for removed tags
    if (tagIdsToDecrement.length > 0) {
      await db.update(tables.tag)
        .set({ photoCount: sql`${tables.tag.photoCount} - 1` })
        .where(inArray(tables.tag.id, tagIdsToDecrement))
    }
  }

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

    // Increment counts for new tags
    await db.update(tables.tag)
      .set({ photoCount: sql`${tables.tag.photoCount} + 1` })
      .where(inArray(tables.tag.id, photoTagOperations.map(op => op.tagId)))
  }
}
