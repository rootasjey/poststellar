// PUT /api/posts/[slug]/article
import { blob } from 'hub:blob'
import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import cleanupOrphanPostImages from '~~/server/utils/postImages'
import type { ApiPost } from '~~/shared/types/post'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const database = db
  const body = await readBody(event)
  const identifier = decodeURIComponent(getRouterParam(event, 'identifier') ?? '')

  if (!identifier) {
    throw createError({ statusCode: 400, message: 'Post identifier is required' })
  }

  if (!body.article) {
    throw createError({ statusCode: 400, message: 'Post article is required' })
  }

  const userId = session.user.id
  const post: ApiPost | null = await getPostByIdentifier(database, identifier)

  if (!post) {
    throw createError({ statusCode: 404, message: 'Post not found' })
  }

  // Check if the user is the author of the post
  if (post.user_id !== userId) {
    throw createError({
      statusCode: 403,
      message: 'You are not authorized to update this post',
    })
  }

  try {
    const articleBlob = new Blob([JSON.stringify(body.article)], { 
      type: 'application/json' 
    })
    
    await blob.put(post.blob_path as string, articleBlob)

    // Run cleanup asynchronously and don't block the article save if it fails
    // Fire-and-forget — log failures but continue execution.
    cleanupOrphanPostImages(database, post.id, body.article).catch((err) => {
      console.warn('cleanupOrphanPostImages failed for post', post.id, err)
    })
    
    await database
      .update(schema.posts)
      .set({ updated_at: new Date().toISOString() })
      .where(eq(schema.posts.id, post.id))
      .run()

    const updatedPostRow = await database.query.posts.findFirst({
      where: eq(schema.posts.id, post.id),
    })

    if (!updatedPostRow) {
      throw createError({ statusCode: 404, message: 'Updated post not found' })
    }

    const updatedPost = updatedPostRow as ApiPost

    return {
      message: 'Post article updated successfully',
      post: updatedPost,
      success: true,
    }
  } catch (error) {
    console.error('Error updating post article:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update post article',
    })
  }
})