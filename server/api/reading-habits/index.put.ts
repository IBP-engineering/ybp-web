import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient<Database>(event)

  const { data } = await supabase
    .from('reading_habits')
    .select('id,update_count')
    .match({ id: body.id, created_by: user.sub })
    .single()

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Data tidak ditemukan',
      statusText: 'Gagal',
    })
  }

  if (data.update_count > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sudah melebihi batas ubah habit',
      statusText: 'Tidak bisa mengubah',
    })
  }

  const { error } = await supabase
    .from('reading_habits')
    .update({
      page_count: body.pageCount,
      summary: body.summary,
      title: body.title,
      genre: body.genre,
      updated_at: new Date().toISOString(),
      update_count: data.update_count + 1,
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
