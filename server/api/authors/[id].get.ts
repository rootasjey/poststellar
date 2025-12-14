import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const identifier = params.id
  const maybeId = Number(identifier)

  const baseSelect = db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      slug: schema.users.slug,
      avatar: schema.users.avatar,
      biography: schema.users.biography,
      job: schema.users.job,
      location: schema.users.location,
      socials: schema.users.socials,
    })
    .from(schema.users)

  const row = Number.isFinite(maybeId)
    ? await baseSelect.where(eq(schema.users.id, maybeId)).get()
    : await baseSelect.where(sql`LOWER(${schema.users.slug}) = LOWER(${identifier})`).get()

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Author not found' })
  }

  return {
    ...row,
    socials: safeParseJson(row.socials),
  }
})

function safeParseJson(val: string | null | undefined) {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : parsed ?? []
  } catch {
    return []
  }
}
