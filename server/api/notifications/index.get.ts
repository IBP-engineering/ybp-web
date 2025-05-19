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
    unreadCount: number
  }> => {
    try {
      const query = getQuery(event)
      const session = await serverSupabaseSession(event)

      if (!session) {
        return { data: [], unreadCount: 0, error: null }
      }

      const user = await serverSupabaseUser(event)

      if (!user) {
        return { data: [], unreadCount: 0, error: null }
      }

      const supabase = await serverSupabaseClient<Database>(event)
      let queryNotification = supabase
        .from('notifications')
        .select('*, sender:users!sender_id(display_name, username)')
        .eq('recipient_id', user.id)

      // Conditionally add the filter for unread notifications
      if (query?.type === 'unread') {
        queryNotification = queryNotification.is('read_at', null)
      }

      // Add the ordering
      queryNotification = queryNotification.order('created_at', {
        ascending: false,
      })

      // Execute the query
      // get unread count
      const [{ data, error }, { count }] = await Promise.all([
        queryNotification,
        supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .eq('recipient_id', user.id)
          .is('read_at', null),
      ])

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 400,
          statusMessage: error.code,
          statusText: error.details,
        })
      }

      return { data, unreadCount: count, error: null }
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
