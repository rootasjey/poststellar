// server/utils/tags.ts
// Utility to upsert tags and update post_tags join table
import { schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import type { ApiTag } from '~~/shared/types/tags'

/**
 * Upsert tags and update post_tags join table for a post.
 * @param db - Database instance
 * @param postId - The post's ID
 * @param tags - Array of { name, category? }
 */
export async function upsertPostTags(
  db: any,
  postId: number,
  tags: Array<{ name: string; category?: string }>
) {
  const tagIds: number[] = []
  const createdTags: Array<ApiTag> = []

  for (const tag of tags) {
    const existing = await db.query.tags.findFirst({
      where: eq(schema.tags.name, tag.name),
    })

    if (existing) {
      tagIds.push(existing.id as number)
      continue
    }

    const inserted = await db.insert(schema.tags).values({
      name: tag.name,
      category: tag.category || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).run()

    const insertedId = Number((inserted as any)?.lastInsertRowid ?? (inserted as any)?.meta?.last_row_id ?? 0)
    const fetched = insertedId
      ? await db.query.tags.findFirst({ where: eq(schema.tags.id, insertedId) })
      : await db.query.tags.findFirst({ where: eq(schema.tags.name, tag.name) })

    if (fetched?.id) {
      tagIds.push(fetched.id as number)
      createdTags.push({
        id: fetched.id as number,
        name: fetched.name,
        category: fetched.category,
        created_at: fetched.created_at,
        updated_at: fetched.updated_at,
      })
    }
  }

  await db.delete(schema.post_tags).where(eq(schema.post_tags.post_id, postId)).run()
  for (const tagId of tagIds) {
    await db.insert(schema.post_tags).values({ post_id: postId, tag_id: tagId }).run()
  }

  return createdTags
}
