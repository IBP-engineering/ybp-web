import {
  serverSupabaseClient,
  serverSupabaseSession,
  serverSupabaseUser,
} from '#supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
import type { Notification, User } from '~/types/entities'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    data: (Notification & {
      sender: Pick<User, 'display_name' | 'username' | 'profile_path'>
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
        .select(
          '*, sender:users!sender_id(display_name, username, profile_path)',
        )
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

      const storyRelatedIds: string[] =
        data.length > 0
          ? data.map(d => {
              if (d.related_entity_type === 'story') {
                return d.related_entity_id
              } else if (d.related_entity_type === 'comment') {
                return d.context_data.story
              }

              return false
            })
          : []

      const uniqueStoryRelatedIds: string[] = [
        ...new Set(storyRelatedIds),
      ].filter(Boolean)

      const stories = await getStoriesByIds(uniqueStoryRelatedIds, supabase)

      const dataWithStory = data.map(data => {
        if (uniqueStoryRelatedIds.length > 0) {
          const findedStory = stories.find(
            st => st.id === data.related_entity_id,
          )

          if (findedStory) {
            return {
              ...data,
              context_data: { ...data.context_data, ...findedStory },
            }
          }
        }

        return data
      })

      return { data: dataWithStory, unreadCount: count ?? 0, error: null }
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

async function getStoriesByIds(
  storyIdsToFetch: string[],
  supabase: SupabaseClient<Database, 'public'>,
) {
  const { data, error } = await supabase
    .from('stories')
    .select('id,title,slug,user_id(username)')
    .in('id', storyIdsToFetch) // Filter where the 'id' is in the provided array

  if (error) {
    console.error('Error fetching stories by IDs:', error)
    return null
  }

  return data
}
