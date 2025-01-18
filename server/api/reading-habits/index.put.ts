import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient<Database>(event)

  const { error } = await supabase
    .from('reading_habits')
    .update({
      page_count: body.pageCount,
      summary: body.summary,
      title: body.title,
      genre: body.genre,
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.id)

  if (error) {
    throw createError({
      statusMessage: error.message,
      statusText: error.name,
      statusCode: 400,
    })
  }

  return { data: body, error: null }
})
