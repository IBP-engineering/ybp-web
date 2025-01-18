import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/database.types'
import { BookGenre, ReadingHabit, User } from '~/types/entities'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    data: Partial<
      Omit<ReadingHabit, 'genre' | 'created_by'> & {
        genre: Partial<BookGenre>
        created_by: Partial<User>
      }
    >[]
    pagination: { total: number; page: number }
  }> => {
    const supabase = await serverSupabaseClient<Database>(event)
    const userId = getRouterParam(event, 'userId')
    const { page = 1, limit = 10 } = getQuery(event)
    const startIndex = (+page - 1) * +limit

    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from('reading_habits')
        .select(
          `id,
        title,
        page_count,
        summary,
        created_at,
        created_by(display_name,username),
        genre(label,multiple)`,
        )
        .order('created_at', { ascending: false })
        .eq('created_by', userId.toString())
        .range(startIndex, startIndex + +limit - 1),
      supabase
        .from('reading_habits')
        .select('id', { count: 'exact' })
        .eq('created_by', userId.toString()),
    ])

    if (error) {
      throw createError({
        message: error.message,
        statusCode: 400,
        statusMessage: error.code,
        statusText: error.details,
      })
    }

    return { data, pagination: { total: count, page: +page }, error: null }
  },
)
