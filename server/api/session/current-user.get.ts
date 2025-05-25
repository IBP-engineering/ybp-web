import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'
import type { User } from '~/types/entities'

export default defineEventHandler(
  async (
    event,
  ): Promise<Partial<User> & { roles: { id: number; name: string } }> => {
    const supabase = await serverSupabaseClient<Database>(event)
    const userSession = await serverSupabaseUser(event)

    if (!userSession) {
      return null
    }

    const { error, data } = await supabase
      .from('users')
      .select('username, id, display_name, created_at, roles(id, name)')
      .eq('id', userSession.id)
      .eq('is_active', true)
      .single()

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
