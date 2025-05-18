import {
  serverSupabaseClient,
  serverSupabaseSession,
  serverSupabaseUser,
} from '#supabase/server'
import type { Database } from '~/types/database.types'
import type { Notification, User } from '~/types/entities'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    data: (Notification & {
      sender: Pick<User, 'display_name' | 'username'>
    })[]
    count: number
  }> => {
    try {
      const session = await serverSupabaseSession(event)

      if (!session) {
        return { data: [], count: 0, error: null }
      }

      const user = await serverSupabaseUser(event)

      if (!user) {
        return { data: [], count: 0, error: null }
      }

      const supabase = await serverSupabaseClient<Database>(event)
      const { data, error } = await supabase
        .from('notifications')
        .select('*, sender:users!sender_id(display_name, username)')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })

      // get unread count
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
        .is('read_at', null)

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 400,
          statusMessage: error.code,
          statusText: error.details,
        })
      }

      return { data, count, error: null }
    } catch (error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Terjadi kesalahan',
        statusText: 'Mohon coba lagi beberapa saat lagi',
      })
    }
  },
)
