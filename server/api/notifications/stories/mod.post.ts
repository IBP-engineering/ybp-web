import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'
import type { Notification } from '~/types/entities'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient<Database>(event)
  const isCreated = body.mode === 'create'

  const { data: allModAndAdmin, error } = await supabase
    .from('users')
    .select('id')
    .eq('is_active', true)
    .neq('role_id', 1)

  if (error) {
    return { data: null, error }
  }

  // send to all moderator and admin
  const notifPayload = allModAndAdmin.map(user => ({
    sender_id: body.senderId,
    recipient_id: user.id,
    related_entity_id: body.relatedId,
    context_data: body.contextData,
    type: isCreated ? 'add_story' : 'update_story',
    related_entity_type: 'story',
    read_at: null,
  })) satisfies Partial<Notification>[]

  const { error: errorInsert } = await supabase
    .from('notifications')
    .insert(notifPayload)

  if (errorInsert) {
    return { data: null, error: errorInsert }
  }

  return { data: body, error: null }
})
