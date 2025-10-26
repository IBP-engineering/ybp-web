import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  const { data: existingNotifications } = await supabase
    .from('notifications')
    .select('id')
    .eq('recipient_id', user.sub)
    .is('read_at', null)

  if (existingNotifications?.length === 0) {
    return { data: 'OK', error: null }
  }

  const updatePromises = existingNotifications.map(record => {
    return supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', record.id)
  })

  const updatedResults = await Promise.all(updatePromises)

  for (const res of updatedResults) {
    if (res.error) {
      console.error('Error updating record', res.error)
    }
  }

  return { data: 'OK', error: null }
})
