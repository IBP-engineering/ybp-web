import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  const { error: errorInsert } = await supabase.from('reading_habits').insert({
    page_count: body.pageCount,
    summary: body.summary,
    title: body.title,
    genre: body.genre,
    created_by: user.id,
    update_count: 0,
  })

  if (errorInsert) {
    return { data: null, error: errorInsert }
  }

  return { data: body, error: null }
})
