import { sql } from 'drizzle-orm'
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const photo = sqliteTable('photos', {
  id: text('id').primaryKey().$defaultFn(() => createCuid(8)),
  // fileInfo
  fileName: text('file_name').notNull(),
  fileModified: integer('file_modified', { mode: 'timestamp' }),
  // R2
  jpeg: text('jpeg'),
  webp: text('webp'),
  avif: text('avif'),
  thumbnail: text('thumbnail'),
  // desc
  title: text('title'),
  caption: text('caption'),
  semanticDescription: text('semantic_description'),
  tags: text('tags'),
  // exif info
  make: text('make'),
  model: text('model'),
  focalLength: integer('focal_length'),
  focalLengthIn35mmFormat: integer('focal_length_in_35mm_format'),
  lensMake: text('lens_make'),
  lensModel: text('lens_model'),
  fNumber: real('f_number'),
  iso: integer('iso'),
  exposureTime: real('exposure_time'),
  exposureCompensation: real('exposure_compensation'),
  locationName: text('location_name'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  takenAt: integer('taken_at', { mode: 'timestamp' }),
  // photo info
  aspectRatio: real('aspect_ratio'),
  // photo config
  priorityOrder: real('priority_order'),
  hidden: integer('hidden', { mode: 'boolean' }).default(false),
  // sql default
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

// New tag table for storing unique tags
export const tag = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => createCuid(8)),
  name: text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

// Junction table for many-to-many relationship between photos and tags
export const photoTag = sqliteTable('photo_tags', {
  photoId: text('photo_id')
    .notNull()
    .references(() => photo.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tag.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, table => [
  primaryKey({ columns: [table.photoId, table.tagId] }),
])
