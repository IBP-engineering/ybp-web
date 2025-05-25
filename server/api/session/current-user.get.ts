import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'
import type { User } from '~/types/entities'

export default defineEventHandler(
  async (
    event,
  ): Promise<Partial<User> & { roles: { id: number; name: string } }> => {
    const userSession = await serverSupabaseUser(event)

    if (!userSession) {
      return null
    }

    const { data, error } = await getCurrentUser(userSession.id, event)

    if (!data) {
      throw createError({
        message: 'User tidak terdaftar',
        statusCode: 401,
        statusMessage: '401',
        statusText: 'Silahkan ulangi beberapa saat lagi',
      })
    }

    if (error) {
      throw createError({
        message: error.message,
        statusCode: 400,
        statusMessage: error.code,
        statusText: error.details,
      })
    }

    return data
  },
)

const getCurrentUser = defineCachedFunction(
  async (id: string, event) => {
    const supabase = await serverSupabaseClient<Database>(event)
    console.log('log', id)

    const { error, data } = await supabase
      .from('users')
      .select('username, id, display_name, created_at, roles(id, name)')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    return { data, error }
  },
  {
    name: 'getCurrentUser',
    maxAge: 60 * 30, // 30 minutes
  },
)
