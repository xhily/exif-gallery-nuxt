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

  // Prepare operations for new tags - set photoCount to 0 (will be incremented later)
  const newTagOperations = tagNames
    .filter(name => !tagMap.has(name))
    .map(name => ({
      name,
      photoCount: 0, // Start with 0, will be incremented later
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

  // Get all tag IDs that will be used
  const allTagIds = tagNames.map(name => tagMap.get(name)!)

  // Find which tags are being added and which are being kept
  const addedTagIds = allTagIds.filter(id => !tagIdsToDecrement.includes(id))
  const removedTagIds = tagIdsToDecrement.filter(id => !allTagIds.includes(id))

  // Batch operations for better performance
  const operations = []

  // 1. Delete existing photo-tag relationships
  if (currentPhotoTags.length > 0) {
    operations.push(
      db.delete(tables.photoTag)
        .where(eq(tables.photoTag.photoId, photoId)),
    )
  }

  // 2. Decrement counts for removed tags
  if (removedTagIds.length > 0) {
    operations.push(
      db.update(tables.tag)
        .set({ photoCount: sql`${tables.tag.photoCount} - 1` })
        .where(inArray(tables.tag.id, removedTagIds)),
    )
  }

  // 3. Create new photo-tag relationships
  const photoTagOperations = allTagIds.map(tagId => ({
    photoId,
    tagId,
  }))

  if (photoTagOperations.length > 0) {
    operations.push(
      db.insert(tables.photoTag)
        .values(photoTagOperations)
        .onConflictDoNothing(),
    )
  }

  // 4. Increment counts for added tags
  if (addedTagIds.length > 0) {
    operations.push(
      db.update(tables.tag)
        .set({ photoCount: sql`${tables.tag.photoCount} + 1` })
        .where(inArray(tables.tag.id, addedTagIds)),
    )
  }

  // Execute all operations in parallel for better performance
  await Promise.all(operations)
}
