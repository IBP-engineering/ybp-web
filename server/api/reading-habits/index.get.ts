import { serverSupabaseClient } from '#supabase/server'
import { endOfDay, startOfDay } from 'date-fns'
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
    const { date, page = 1, limit = 10 } = getQuery(event)
    const startDate = startOfDay(new Date(date?.toString())).toISOString()
    const endDate = endOfDay(new Date(date?.toString())).toISOString()
    const startIndex = (+page - 1) * +limit

    const { error, data } = await supabase
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
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + +limit - 1)

    const { count } = await supabase
      .from('reading_habits')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate)
      .lte('created_at', endDate)

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
