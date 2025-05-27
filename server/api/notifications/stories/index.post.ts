import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient<Database>(event)

  if (body.senderId === body.recipientId) {
    // skip if the same user
    return { data: null, error: null }
  }

  const { error } = await supabase.from('notifications').insert({
    sender_id: body.senderId,
    recipient_id: body.recipientId,
    related_entity_id: body.relatedId,
    context_data: body.contextData,
    type: body.type,
    related_entity_type: body.relatedType,
    read_at: null,
  })

  if (error) {
    throw createError({
      message: error.message,
      statusCode: 400,
      statusMessage: error.code,
      statusText: error.details,
    })
  }

  return { data: body, error: null }
})
