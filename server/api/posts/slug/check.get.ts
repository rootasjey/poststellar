// GET /api/posts/slug/check?slug=some-slug&excludeId=123 (excludeId optional)
import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  slug: z.string().min(1).max(255),
  excludeId: z.coerce.number().optional(),
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const validated = querySchema.safeParse(query)

  if (!validated.success) {
    throw createError({ statusCode: 400, message: 'Invalid query' })
  }

  const { slug, excludeId } = validated.data

  // Check if slug exists in posts table for a different post id
  const row = await db.query.posts.findFirst({
    where: eq(schema.posts.slug, slug),
    columns: { id: true },
  })

  const exists = !!row && (excludeId ? row.id !== excludeId : true)

  return { exists, id: row?.id ?? null }
})
