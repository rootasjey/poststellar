// GET /api/posts/:id/tags
import { db, schema } from 'hub:db'
import { eq, sql } from 'drizzle-orm'
import type { ApiPost } from '~~/shared/types/post'
import { getPostByIdentifier } from '~~/server/utils/post'

export default defineEventHandler(async (event) => {
  const identifier = getRouterParam(event, 'identifier') || ''

  if (!identifier) {
    throw createError({ statusCode: 400, statusMessage: 'Post identifier (id or slug) is required' })
  }

  let postId: number | string = identifier
  if (!/^\d+$/.test(String(identifier))) {
    const apiPost: ApiPost | null = await getPostByIdentifier(db, identifier)
    if (!apiPost) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    postId = apiPost.id
  }

  const tags = await db
    .select({ tag: schema.tags })
    .from(schema.tags)
    .innerJoin(schema.post_tags, eq(schema.post_tags.tag_id, schema.tags.id))
    .where(eq(schema.post_tags.post_id, Number(postId)))
    .orderBy(sql`tags.name ASC`)

  return tags.map((row: any) => row.tag)
})