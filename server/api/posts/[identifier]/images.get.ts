// GET /api/posts/[identifier]/images
import { db, schema } from 'hub:db'
import { desc, eq } from 'drizzle-orm'
import type { ApiPost } from '~~/shared/types/post'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id

  const identifier = decodeURIComponent(getRouterParam(event, 'identifier') ?? '')
  if (!identifier) throw createError({ statusCode: 400, message: 'Post identifier is required' })

  const post: ApiPost | null = await getPostByIdentifier(db, identifier)
  if (!post) throw createError({ statusCode: 404, message: 'Post not found' })
  if (post.user_id !== userId) throw createError({ statusCode: 403, message: 'You are not authorized to view this post images' })

  const rows = await db
    .select()
    .from(schema.post_images)
    .where(eq(schema.post_images.post_id, post.id))
    .orderBy(desc(schema.post_images.created_at))

  return {
    success: true,
    images: rows,
  }
})
