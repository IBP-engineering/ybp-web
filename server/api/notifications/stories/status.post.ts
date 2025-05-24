import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient<Database>(event)

  const { error: errorInsert } = await supabase.from('notifications').insert({
    sender_id: body.senderId,
    recipient_id: body.recipientId,
    related_entity_id: body.relatedId,
    context_data: body.contextData,
    type: body.type,
    related_entity_type: 'story',
    read_at: null,
  })

  if (errorInsert) {
    return { data: null, error: errorInsert }
  }

  return { data: body, error: null }
})
